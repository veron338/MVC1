import mongoose from "mongoose"

const schema = new mongoose.Schema({
    brand: String,
    model: String,
    price: {type: Number, min:0},
    color: [String],
    technic: {},
    category: String,
    img: String
})

// products  -> Product
const Product = mongoose.model( "Product", schema )

export default Product