const mongoose = require('mongoose');
const CartItem = require('./cartItem');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },  
    cartItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem' }]  
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
