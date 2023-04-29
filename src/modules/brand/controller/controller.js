
import { nanoid } from 'nanoid';
import brandModel from '../../../../DB/model/brand.model.js';
import subCategoryModel from './../../../../DB/model/subCategory.model.js';
import cloudinary from './../../../utils/cloudinary.js';


export const addBrand = async (req,res,next) => {
    const {name}= req.body;
    const {subCategoryId} = req.params;

    const subCategory = await subCategoryModel.findById(subCategoryId)
    if (!subCategory) {
        return next(new Error('subcategory not found', {cause:400}))
    }
    if (await brandModel.findOne({name,subCategoryId})) {
        return next(new Error('duplicated brand ', {cause:400}))
        
    }
  
        const customId = nanoid(5)
        const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{
            folder:`${process.env.PROJECT_FOLDER}/categories/subcategories/${subCategory.customId}/brand/${customId}`
        })
        if (!Object.keys(req.body).length) {
            return next(new Error('please enter fileds',{cause:400}))
        }

        const brand = await brandModel.create({
            name,
            logo:{
                path:secure_url,
                public_id
            },
            customId,
            subCategoryId,
            createdBy:req.user._id
        })
        if (!brand) {
            await cloudinary.uploader.destroy(public_id)
        return next(new Error('fail try again later '))
            
        }
        res.status(201).json({message:'success', brand})


}