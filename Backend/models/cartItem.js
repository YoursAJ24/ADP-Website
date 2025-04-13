const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },  // Reference to the Cart model
    item_id: { type: String },
    itemName: { type: String , required: true },
    ordered_quantity: { type: Number, required: true, min: 1 },
    allotted_quantity: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Ready', 'Rejected', 'Delivered', 'Amazon'], default: 'Pending' },
    remarks: { type: String, required: false },
    link : { type: String, required: false }
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
