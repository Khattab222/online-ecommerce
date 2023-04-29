import slugify from "slugify";
import cloudinary from './../../utils/cloudinary.js';
import { nanoid } from "nanoid";
import categoryModel from './../../../DB/category.models.js';
import subCategoryModel from "../../../DB/model/subCategory.model.js";


// create category 
export const creatCategory = async (req,res,next) => {
  const {name} = req.body;
  const slug = slugify(name,'_');

  const catExist = await categoryModel.findOne({name});
  if (catExist) {
    res.status(400).json({message:'duplicat category name'})
  }
  // if (!req.file) {
  //   return res.status(400).json({message:'please choose pic'})
  // }
const customId = nanoid(5) 
  const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
    folder:`${process.env.PROJECT_FOLDER}/Categories/${customId}`
  });
 

  const category = await categoryModel.create({
    name,
    slug,
    image:{
        path:secure_url,
        public_id
    },
    customId,
    createdBy:req.user._id

  })
  if (!category) {
    await cloudinary.uploader.destroy(public_id);
  return res.status(400).json({message:'fail try again later'})


  }
  return res.status(201).json({message:`category ${name} created successfully`,category})

}

// update category
export const updateCategory = async (req,res,next) => {
  const {categoryId} = req.params;
const category = await categoryModel.findById(categoryId)
  if (req.body.name) {
    if (category.name ==req.body.name ) {
      return next (new Error('please choose another name ',{cause:400}))
    }
    if (await categoryModel.findOne({name:req.body.name})) {
      return next (new Error('name already exists',{cause:400})) 
    }
    category.name = req.body.name;
    category.slug = slugify(req.body.name,"_")
  }
  if (req.file) {
 
    await cloudinary.uploader.destroy(category.image.public_id);
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
      folder:`${process.env.PROJECT_FOLDER}/Categories/${category.customId}`
    });
   
    category.image={
      path:secure_url,
      public_id
    }
  }
  if (!Object.keys(req.body).length) {
    return next (new Error('please enter update fields',{cause:400}))
  }
  category.updatedBy = req.user._id
  const updatedCategory = await category.save();
  if (!updatedCategory) {
   return next (new Error('update fail try again later'))
  }
  res.status(200).json({message:'update done',updatedCategory})
}

// get all category 
export const getAllCategory = async (req,res,next) => {
  
  const category = await categoryModel.find({}).populate('subCategories')
  if (category.length) {
  return  res.status(200).json({message:'success',category})
  }
  res.status(200).json({message:'empty'})

}

