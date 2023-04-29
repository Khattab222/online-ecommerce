import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    products: [
        {
            productId: {
                type:  mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
},{
    timestamps:true
})
const cartModel = mongoose.models.Cart || mongoose.model('Cart',cartSchema)

export default cartModel