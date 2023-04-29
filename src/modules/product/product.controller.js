import categoryModel from "./../../../DB/category.models.js";
import subCategoryModel from "./../../../DB/model/subCategory.model.js";
import brandModel from "./../../../DB/model/brand.model.js";
import slugify from "slugify";
import productModel from "./../../../DB/model/product.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import { pagination } from "../../utils/pagination.js";
import ApiFeatures from "../../utils/apifeatures.js";
import userModel from "../../../DB/model/User.model.js";


// add product
export const adProduct = async (req, res, next) => {
  // IDs
  const { categoryId, subCategoryId, brandId, name, price, discount } =
    req.body;
  const Category = await categoryModel.findById(categoryId);
  const subCategory = await subCategoryModel.findOne({
    _id: subCategoryId,
    categoryId,
  });
  const brand = await brandModel.findOne({ _id: brandId, subCategoryId });
  if (!Category || !subCategory || !brand) {
    return next(new Error("in-valid ids", { cause: 400 }));
  }
  // createdBy
  req.body.createdBy = req.user._id;
  // name
  req.body.slug = slugify(name, {
    replacment: "_",
    lower: true,
  });

  // prices
  // 500 * (1 - 0.25) =375
  req.body.priceAfterDiscount = price * (1 - (discount || 0) / 100);

  // Images => { mainImage:[{}]  , subImages:[{}, {}]}
  // console.log(req.files)
  // mainIamge
  const customId = nanoid(5);
  req.body.customId = customId;

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    {
      folder: `${process.env.PROJECT_FOLDER}/categories/subcategories/${subCategory.customId}/brand/${brand.customId}/Products/${customId}`,
    }
  );

  req.body.mainImage = {
    path: secure_url,
    public_id,
  };
  // subImages
  if (req.files.subImages) {
    req.body.subImages = [];
    for (const file of req.files.subImages) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.PROJECT_FOLDER}/categories/subcategories/${subCategory.customId}/brand/${brand.customId}/Products/${customId}`,
        }
      );
      req.body.subImages.push({
        path: secure_url,
        public_id,
      });
    }
  }

  const product = await productModel.create(req.body);
  if (!product) {
    // destory, assginment
    await cloudinary.uploader.destroy(req.body.mainImage.public_id);
    if (req.body.subImages.length) {
      let deletPics = [];
      for (const file of req.body.subImages) {
        deletPics.push(file.public_id);
      }
      await cloudinary.api.delete_resources(deletPics);
    }
    return next(new Error("fail", { cause: 500 }));
  }

  return res.status(201).json({ message: "Done", product });
};



// update product
export const updateProduct = async (req, res, next) => {
  const { productId } = req.params
  const product = await productModel.findById(productId)
  if (!product) {
      return next(new Error('in-valid procustId', { cause: 400 }))
  }
  const { name, price, discount } = req.body
  //name 
  if (name) {
      req.body.slug = slugify(name, {
          replacment: '_',
          lower: true
      })
  }

  // price 
  if (price && discount) {
      req.body.priceAfterDiscount = price * (1 - ((discount) / 100))
      // } else if (price) {
      //     req.body.priceAfterDiscount = price * (1 - ((product.discount) / 100))
      // } else if (discount) {
      //     req.body.priceAfterDiscount = product.price * (1 - ((discount) / 100))
      // }
  } else if (price || discount) {
      req.body.priceAfterDiscount = (price || product.price) * (1 - ((discount || product.discount) / 100))
  }
  const Category = await categoryModel.findById(product.categoryId)
  const subCategory = await subCategoryModel.findOne({ _id: product.subCategoryId, categoryId: product.categoryId })
  const brand = await brandModel.findOne({ _id: product.brandId, subCategoryId: product.subCategoryId })
  // mainImage
  if (req.files?.mainImage?.length) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, {
          folder: `${process.env.PROJECT_FOLDER}/categories/subcategories/${subCategory.customId}/brand/${brand.customId}/Products/${product.customId}`
      })
      await cloudinary.uploader.destroy(product.mainImage.public_id)

      req.body.mainImage = {
          path: secure_url,
          public_id
      }
  }

  // subImages
  if (req.files?.subImages?.length) {
    let deletPics = [];
      for (const file of product.subImages) {
        deletPics.push(file.public_id);
      }
      await cloudinary.api.delete_resources(deletPics);
      req.body.subImages = []
      for (const file of req.files.subImages) {
          const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
              folder: `${process.env.PROJECT_FOLDER}/categories/subcategories/${subCategory.customId}/brand/${brand.customId}/Products/${product.customId}`
          })
          req.body.subImages.push({
              path: secure_url,
              public_id
          })
      }
  }

  req.body.updatedBy = req.user._id
  const savedProduct = await productModel.findByIdAndUpdate(productId, req.body, { new: true })
  if (!savedProduct) {
      return next(new Error('in-valid procustId fail to update', { cause: 400 }))
  }
  res.status(200).json({ message: "Done", savedProduct })

  }

  // product list
  export const productList = async (req,res,next) => {


    const apifeature = new ApiFeatures(productModel.find().populate('reviews'),req.query).pagination().filter().sort().search().select()


    const products = await apifeature.mongooseQuery;
    
    for (let i = 0; i < products.length; i++) {
     let calcrating = 0
     for (let j = 0; j < products[i].reviews.length; j++) {
      calcrating += products[i].reviews[j].rating
      
     }
     let avgRating = calcrating/products[i].reviews.length
     const product = products[i].toObject();
     product.avgRating  =avgRating;
     products[i]= product
      
    }
    res.status(200).json({message:'done',products})

  }

  // add to wishList
  export const addToWishList = async (req,res,next) => {
    const product = await productModel.findById(req.params.productId);
    if (!product) {
      return next(new Error('invalid productId',{cause:400}))
    }
    const updateUser = await userModel.updateOne({_id:req.user._id},{
      $addToSet:{

        wishList:req.params.productId
      }
    })
    res.status(201).json({message:'done'})
  }

  // remove from wishlist 
  export const removefromWishList = async (req,res,next) => {
  
    const updateUser = await userModel.updateOne({_id:req.user._id},{
      $pull:{

        wishList:req.params.productId
      }
    })
    res.status(201).json({message:'done'})
  }
  
