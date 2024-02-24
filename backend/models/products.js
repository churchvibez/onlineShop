const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
{
    name:
    {
        type: String,
        required: true,
    },
    brand:
    {
        type: String,
        required: true,
    },
    category:
    {
        type: String,
        required: true,
    },
    image:
    {
        type: String,
        required: true,
    },
    number:
    {
        type: Number,
        required: true
    }
}
)

const Product = mongoose.model('Product', productSchema);
module.exports = Product;