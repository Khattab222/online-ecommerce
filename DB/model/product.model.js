
import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    // descriptions
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    slug: String,
    description: String,
    stock: {
        type: Number,
        required: true,
        default: 1
    },
    // price
    price: {
        type: Number,
        required: true,
        default: 1
    },
    discount: {
        type: Number,
        default: 0
    },
    priceAfterDiscount: {
        type: Number,
        default: 0
    },
    // sepecifications
    colors: [String],
    size: [String],
    // images
    mainImage: { type: Object, required: true },
    subImages: { type: [Object] },

    // IDs
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory",
        required: true
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    customId: String,

    // two fileds
    isDeleted: {
        type: Boolean,
        default: false
    },
    userAddToWishList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]

}, {
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

productSchema.virtual('reviews',{
    localField:'_id',
    ref:'Review',
    foreignField:'productId'
})


const productModel = mongoose.models.Product || mongoose.model('Product', productSchema)

export default productModel
