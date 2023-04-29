import slugify from "slugify";
import cloudinary from "../../utils/cloudinary.js";
import { nanoid } from 'nanoid';
import subCategoryModel from "../../../DB/model/subCategory.model.js";
import categoryModel from './../../../DB/category.models.js';



// create subcategory
export const creatSubCategory = async (req,res,next) => {
   const {name}= req.body;
   const {categoryId} = req.params;
if (!await categoryModel.findOne({_id:categoryId})) {
    return next (new Error('invalid category id ', {cause:400}))
}
const subcatExist = await subCategoryModel.findOne({name});
if (subcatExist) {
return  res.status(400).json({message:'duplicat subcategory name'})
}

   const slug  = slugify(name,'_');

const customId = nanoid(5)
   const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
    folder:`${process.env.PROJECT_FOLDER}/categories/subcategories/${customId}`
   })
   if (!Object.keys(req.body).length) {
    return next (new Error('please enter update fields',{cause:400}))
  }


   const subcat = await subCategoryModel.create({
    name,
    slug,
    image:{
        path:secure_url,
        public_id
    },
    categoryId,
    customId,
   createdBy:req.user._id
   });


   if (!subcat) {
    await cloudinary.uploader.destroy(public_id);
    return res.status(400).json({message:'fail try again later'})
  }
  res.status(201).json({message:`subcategory ${name} created successfully`,subcat})

}


// update subcategory
export const updateSubCategory = async (req,res,next) => {
   const {sunCategoryId} = req.params;
 const subcategory = await subCategoryModel.findById(sunCategoryId);
 if (!subcategory) {
   return next (new Error('invalid subcategory id',{cause:400}))
   
 }
   if (req.body.name) {
     if (subcategory.name ==req.body.name ) {
       return next (new Error('please choose another name ',{cause:400}))
     }
     if (await subCategoryModel.findOne({name:req.body.name})) {
       return next (new Error('name already exists',{cause:400})) 
     }
     subcategory.name = req.body.name;
     subcategory.slug = slugify(req.body.name,"_")
   }
   if (req.file) {
  
     await cloudinary.uploader.destroy(subcategory.image.public_id);
     const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
       folder:`${process.env.PROJECT_FOLDER}/Categories/subcategories/${subcategory.customId}`
     });
    
     subcategory.image={
       path:secure_url,
       public_id
     }
   }
   if (!Object.keys(req.body).length) {
    return next (new Error('please enter update fields',{cause:400}))
  }
  subcategory.updatedBy = req.user._id
 
   const updatedsubCategory = await subcategory.save();
   if (!updatedsubCategory) {
    return next (new Error('update fail try again later'))
   }
   res.status(200).json({message:'update done',updatedsubCategory})
 }
