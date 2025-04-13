const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const Inventory = require('../models/inventory');
const authMiddleware = require('../services/authMiddleware');
const CartItem = require('../models/cartItem');


// Rate limiter to prevent brute-force attacks
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100000 // Limit each IP to 100 requests per `window`
});

// Middleware to validate and sanitize inputs
const validateInventoryInput = [
    body('itemQuantity').isInt({ min: 0 }).withMessage('Quantity must be a positive integer').toInt(),
    body('itemStatus').isIn(['enabled', 'disabled']).withMessage('Invalid status'),
    // body('itemName').trim().escape().notEmpty().withMessage('Name is required'),
    validationResultHandler
];

// Middleware to validate ID parameter
const validateIdParam = [
    param('id').isMongoId().withMessage('Invalid ID format'),
    validationResultHandler
];

// Handle validation errors
function validationResultHandler(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

// Route to create a new inventory item (restricted to bosslevel)
router.post('/inventory', authMiddleware('bosslevel'), apiLimiter, validateInventoryInput, async (req, res) => {
    const { itemQuantity, itemStatus, itemName } = req.body;
    try {
        const newInventory = new Inventory({
            itemQuantity,
            itemStatus,
            itemName
        });

        await newInventory.save();
        res.status(201).json(newInventory);
    } catch (err) {
        if (err.code && err.code === 11000) { // MongoDB duplicate key error code
            res.status(400).json({ error: 'Item name must be unique. This item already exists.' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Route to get all inventory items (restricted to bosslevel)
router.get('/inventory', authMiddleware('bosslevel'), apiLimiter, async (req, res) => {
    try {
        const items = await Inventory.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all inventory items (restricted to user)
router.get('/inventory/user', authMiddleware('user'), apiLimiter, async (req, res) => {
    try {
        const items = await Inventory.find({"itemStatus":"enabled"}, 'itemName itemStatus');
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to delete an inventory item (restricted to bosslevel)
router.delete('/inventory/:id', authMiddleware('bosslevel'), apiLimiter, validateIdParam, async (req, res) => {
    const { id } = req.params;
    const retardId = id.toString();
    try {
        const [deletedItem, deletecartitem] = await Promise.all([
            Inventory.findByIdAndDelete(id),
            CartItem.deleteMany({item_id:retardId})
        ]);
    
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
    
        res.status(200).json({ 
            message: "Item deleted successfully", 
            deletedItem,
            deletecartitem
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
});

// Route to edit an inventory item (name, status, and quantity) by item ID (restricted to bosslevel)
router.put('/inventory/:id', authMiddleware('bosslevel'), apiLimiter, validateIdParam, validateInventoryInput, async (req, res) => {
    const { id } = req.params;
    const { itemName, itemStatus, itemQuantity } = req.body;

    try {
        const updatedItem = await Inventory.findByIdAndUpdate(
            id,
            { 
                itemName, 
                itemStatus, 
                itemQuantity 
            },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json({ message: "Item updated successfully", updatedItem });
    } catch (err) {
        if (err.code && err.code === 11000) { // MongoDB duplicate key error code
            res.status(400).json({ error: 'Item name must be unique. This name already exists.' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});


router.put('/update-inventory-items',
    authMiddleware('bosslevel'),
    async (req, res) => {
        try {
            const items  = req.body;
            console.log(items);
            

            // Create an array to hold update promises
            const updatePromises = items.map(async (item) => {
                const { _id, itemOrderedStatus, itemRemark } = item;

                // Fetch the current CartItem
                const inventory= await Inventory.findById(_id);
                if (!inventory) {
                    throw new Error(`inventory item with ID ${_id} not found.`);
                }

                // Update status and remarks if provided
                if (itemOrderedStatus !== undefined) {
                    inventory.itemOrderedStatus = itemOrderedStatus;
                }

                if (itemRemark !== undefined) {
                    inventory.itemRemark = itemRemark;
                }

                // Save the updated inventory item
                return inventory.save();
            });

            // Execute all update promises
            const updatedInventoryItems = await Promise.all(updatePromises);

            res.status(200).json(updatedInventoryItems);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

module.exports = router;
