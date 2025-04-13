const mongoose = require('mongoose');

const inventSchema = new mongoose.Schema({
    itemQuantity: { type: Number, required: true },
    itemStatus: { type: String, enum: ['enabled','disabled'], default: 'enabled' },
    itemName: { type: String, required: true, unique: true },
    itemOrderedStatus: { type: String, enum: ['Available', 'Ordered from Akshay', 'Ordered from Amazon', 'Not Available'], default: 'Available'},        //Wheather the item is ordered from akshay/amazon or not
    itemRemark: { type: String , required: false }
});

inventSchema.index({ itemName: 1 }, { unique: true }); 
const Inventory = mongoose.model('Inventory', inventSchema);

module.exports = Inventory;

// Connect to MongoDB and create index on startup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected");
        // Create indexes
        return Inventory.createIndexes();
    })
    .catch(err => console.error(err));
