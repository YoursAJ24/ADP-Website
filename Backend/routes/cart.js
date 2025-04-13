const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const CartItem = require('../models/cartItem');
const Inventory = require('../models/inventory');
const authMiddleware = require('../services/authMiddleware');
const { body, param, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Rate Limiter for cart routes
const cartRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100000, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

router.use(cartRateLimiter);

// Post a list of items to the cart (restricted to user)
router.post('/add-items',
    authMiddleware('user'),
    [
        body('userId').isMongoId().withMessage('Invalid user ID'),
        body('items').isArray().withMessage('Items must be an array'),
        body('items.*.item_id').isMongoId().withMessage('Invalid item ID'),
        body('items.*.ordered_quantity').isInt({ min: 1 }).withMessage('Ordered quantity must be a positive integer')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, items } = req.body;

        try {
            let cart = await Cart.findOne({ userId });

            if (!cart) {
                cart = new Cart({
                    userId,
                    cartItems: []
                });
            }

            for (let item of items) {
                const inventoryItem = await Inventory.findById(item.item_id);
                if (!inventoryItem) {
                    return res.status(404).json({ error: `Item with ID ${item.item_id} not found in inventory` });
                }

                let existingCartItem = await CartItem.findOne({
                    cart: cart._id,
                    item_id: item.item_id
                });

                if (existingCartItem) {
                    existingCartItem.ordered_quantity += item.ordered_quantity;

                    await existingCartItem.save();
                } else {
                    const newCartItem = new CartItem({
                        cart: cart._id,
                        item_id: item.item_id,
                        itemName: inventoryItem.itemName,
                        ordered_quantity: item.ordered_quantity
                    });

                    await newCartItem.save();
                    cart.cartItems.push(newCartItem._id);
                }
            }

            await cart.save();
            res.status(200).json(cart);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// POST a custom item to the cart (restricted to user)
router.post('/add-custom-item',
    authMiddleware('user'),
    [
        body('userId').isMongoId().withMessage('Invalid user ID'),
        body('itemName').isString().withMessage('Item name must be a string'),
        body('ordered_quantity').isInt({ min: 1 }).withMessage('Ordered quantity must be a positive integer'),
        body('link').optional().isString().withMessage('Link must be a string') // New validation for link
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, itemName, ordered_quantity, link } = req.body;

        try {
            let cart = await Cart.findOne({ userId });

            if (!cart) {
                cart = new Cart({
                    userId,
                    cartItems: []
                });
            }

            // Check if the custom item already exists in the cart
            let existingCartItem = await CartItem.findOne({
                cart: cart._id,
                itemName: itemName,  // Matching by name since it's a custom item
                item_id: { $exists: false }  // Ensuring it's a custom item with no item_id
            });

            if (existingCartItem) {
                // If it exists, update the quantity and link
                existingCartItem.ordered_quantity += ordered_quantity;

                if (link !== undefined) {
                    existingCartItem.link = link;
                }

                await existingCartItem.save();
            } else {
                // If it doesn't exist, create a new CartItem
                const newCartItem = new CartItem({
                    cart: cart._id,
                    item_id: null,  // No item_id since it's a custom item
                    itemName,
                    ordered_quantity,
                    link  // Store the provided link
                });

                await newCartItem.save();
                cart.cartItems.push(newCartItem._id);
            }

            await cart.save();
            res.status(200).json(cart);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// Get all cart items for a user (restricted to user)
router.get('/cart-items-final/:userId',
    authMiddleware('user'),
    [param('userId').isMongoId().withMessage('Invalid user ID')],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId } = req.params;

        try {
            const cart = await Cart.findOne({ userId }).populate('cartItems', 'itemName ordered_quantity status remarks');

            if (!cart || cart.cartItems.length === 0) {
                return res.status(404).json({ message: "No items found for this user." });
            }
            res.status(200).json(cart.cartItems);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// Remove an item from the cart (restricted to Admin)
router.delete('/remove-item/:cart/:itemName',
    authMiddleware('bosslevel'),
    [
        param('cart').isMongoId().withMessage('Invalid cart ID'),
        param('itemName').isString().withMessage('Invalid item name')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { cart, itemName } = req.params;

        try {
            // Find the cart by cart ID
            let cartDoc = await Cart.findOne({ _id: cart });

            if (!cartDoc) {
                return res.status(404).json({ error: 'Cart not found.' });
            }

            // Find the cart item by itemName in the cart
            const cartItem = await CartItem.findOne({ cart: cartDoc._id, itemName });

            if (!cartItem) {
                return res.status(404).json({ error: 'Item not found in the cart.' });
            }

            // Delete the found cart item
            await CartItem.deleteOne({ _id: cartItem._id });

            // Remove the cart item from the cart's cartItems array
            cartDoc.cartItems = cartDoc.cartItems.filter(id => !id.equals(cartItem._id));

            if (cartDoc.cartItems.length === 0) {
                // Delete the cart if it's empty
                await Cart.deleteOne({ _id: cartDoc._id });
                return res.status(200).json({ message: 'Item removed and cart deleted as it was empty.' });
            } else {
                // Save the updated cart
                await cartDoc.save();
                return res.status(200).json({ message: 'Item removed from the cart.', cart: cartDoc });
            }

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);



// Get all cart items for a user (restricted to bosslevel)
router.get('/cart-items-user/:userId',
    authMiddleware('bosslevel'),
    [param('userId').isMongoId().withMessage('Invalid user ID')],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId } = req.params;

        try {
            const cart = await Cart.findOne({ userId }).populate('cartItems', 'itemName ordered_quantity allotted_quantity status remarks link');

            if (!cart || cart.cartItems.length === 0) {
                return res.status(404).json({ message: "No items found for this user." });
            }
            res.status(200).json(cart.cartItems);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// Get a list of clubs (restricted to bosslevel)
router.get('/get-club-list',
    authMiddleware('bosslevel'),
    async (req, res) => {
        try {
            const carts = await Cart.find()
                .populate({
                    path: 'userId',
                    select: 'clubName cordName mobile'
                })
                .select('_id userId');

            const clubList = carts.map(cart => ({
                clubName: cart.userId.clubName,
                cordName: cart.userId.cordName,
                contact: cart.userId.mobile,
                cart_id: cart._id,
                user_id: cart.userId._id
            }));

            res.status(200).json(clubList);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// Update the status of a cart item (restricted to bosslevel)
router.put('/update-cart-item-status/:cartItemId',
    authMiddleware('bosslevel'),
    [
        param('cartItemId').isMongoId().withMessage('Invalid cart item ID'),
        body('allotted_quantity').optional().isInt({ min: 0 }).withMessage('Allotted quantity must be a non-negative integer'),
        body('status').optional().isString().isIn(['pending', 'ready', 'rejected', 'delivered', 'amazon']).withMessage('Invalid status value'),
        body('remarks').optional().isString().withMessage('Remarks must be a string')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { cartItemId } = req.params;
            const { allotted_quantity, status, remarks } = req.body;

            // Fetch the current CartItem
            const cartItem = await CartItem.findById(cartItemId);
            if (!cartItem) {
                return res.status(404).json({ error: 'CartItem not found.' });
            }

            // Update the allotted quantity by adding the new quantity to the existing one
            if (allotted_quantity !== undefined) {
                cartItem.allotted_quantity += allotted_quantity;
            }

            // Update status and remarks if provided
            if (status !== undefined) {
                cartItem.status = status;
            }

            if (remarks !== undefined) {
                cartItem.remarks = remarks;
            }

            // Save the updated CartItem
            const updatedCartItem = await cartItem.save();

            res.status(200).json(updatedCartItem);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

router.put('/update-multiple-cart-items',
    authMiddleware('bosslevel'),
    body('items').isArray().withMessage('Items must be an array of cart item updates').custom((items) => {
        // Custom validation to check if each item in the array has a valid structure
        return items.every(item => 
            item._id && 
            (item.allotted_quantity !== undefined || 
            item.status !== undefined || 
            item.remarks !== undefined)
        );
    }).withMessage('Each item must have an _id and at least one field to update'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { items } = req.body;

            // Create an array to hold update promises
            const updatePromises = items.map(async (item) => {
                const { _id, allotted_quantity, status, remarks } = item;

                // Fetch the current CartItem
                const cartItem = await CartItem.findById(_id);
                if (!cartItem) {
                    throw new Error(`CartItem with ID ${_id} not found.`);
                }

                // Update the allotted quantity by adding the new quantity to the existing one
                if (allotted_quantity !== undefined) {
                    cartItem.allotted_quantity += allotted_quantity;
                }

                // Update status and remarks if provided
                if (status !== undefined) {
                    cartItem.status = status;
                }

                if (remarks !== undefined) {
                    cartItem.remarks = remarks;
                }

                // Save the updated CartItem
                return cartItem.save();
            });

            // Execute all update promises
            const updatedCartItems = await Promise.all(updatePromises);

            res.status(200).json(updatedCartItems);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);


router.get('/cart-item-summary', authMiddleware('bosslevel'), async (req, res) => {
    try {
        // Fetch all inventory items
        const inventories = await Inventory.find();
        // Fetch all cart items
        const cartItems = await CartItem.find();

        // Group cart items by item_id, treat null item_ids as individual entities
        const cartItemsById = cartItems.reduce((acc, item) => {
            const key = item.item_id ? item.item_id.toString() : item._id.toString();
            if (!acc[key]) {
                acc[key] = {
                    _id: item._id,
                    totalOrderedQuantity: 0,
                    totalAllottedQuantity: 0,
                    itemName: item.itemName,
                    itemOrderedStatus: '',
                    itemRemark: '',
                };
            }
            acc[key].totalOrderedQuantity += item.ordered_quantity;
            acc[key].totalAllottedQuantity += item.allotted_quantity;
            return acc;
        }, {});

        // Prepare the response for each inventory item
        const response = inventories.map(inventory => {
            const cartData = cartItemsById[inventory._id.toString()] || { totalOrderedQuantity: 0, totalAllottedQuantity: 0 };
            return {
                _id: inventory._id,
                itemName: inventory.itemName,
                availableQuantity: inventory.itemQuantity,
                totalOrderedQuantity: cartData.totalOrderedQuantity,
                totalAllottedQuantity: cartData.totalAllottedQuantity,
                itemOrderedStatus: inventory.itemOrderedStatus || '',
                itemRemark: inventory.itemRemark || '',
            };
        });


        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/cart-item-summary-custom', authMiddleware('bosslevel'), async (req, res) => {
    try {
        // Fetch all cart items where item_id is null (custom items)
        const cartItems = await CartItem.find({ item_id: null });

        // Directly return the fetched cart items without modifying the structure
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});





router.put('/update-items-status',
    authMiddleware('bosslevel'),
    [
        body('items').isArray().withMessage('Items should be an array'),
        body('items.*._id').isMongoId().withMessage('Invalid cart item ID'),
        body('items.*.status').optional().isString().isIn(['pending', 'ready', 'rejected', 'delivered', 'amazon']).withMessage('Invalid status value'),
        body('items.*.remarks').optional().isString().withMessage('Remarks must be a string'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { items } = req.body;

            // Fetch all inventory items
            const inventories = await Inventory.find();
            const inventoryIds = inventories.map(inv => inv._id.toString());

            // Process each item in the request
            for (const item of items) {
                const { _id, status, remarks } = item;

                // Find the cart item
                const cartItem = await CartItem.findById(_id);
                if (!cartItem) {
                    return res.status(404).json({ error: `Cart item with ID ${_id} not found.` });
                }

                // Check if the cart item has a corresponding inventory
                if (inventoryIds.includes(cartItem.item_id.toString())) {
                    // Update status and remarks if provided
                    if (status !== undefined) {
                        cartItem.status = status;
                    }

                    if (remarks !== undefined) {
                        cartItem.remarks = remarks;
                    }

                    // Save the updated CartItem
                    await cartItem.save();
                }
                // Ignore items without inventory records
            }

            res.status(200).json({ message: 'Cart items updated successfully.' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

router.delete('/remove-cart/:cart_id', authMiddleware('bosslevel'), cartRateLimiter, async (req, res) => {
    const { cart_id } = req.params;
    try {
        const [deletedcart, deletecartitem] = await Promise.all([
            Cart.findByIdAndDelete(cart_id),
            CartItem.deleteMany({cart: cart_id})
        ]);
    
        if (!deletedcart) {
            return res.status(404).json({ message: "Cart not found" });
        }
    
        res.status(200).json({ 
            message: "Cart deleted successfully", 
            deletedcart,
            deletecartitem
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
});





module.exports = router;
