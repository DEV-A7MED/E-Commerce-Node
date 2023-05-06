
import slugify from 'slugify'
import categoryModel from '../../../DB/model/CategoryModel.js';
import { nanoid } from 'nanoid';
import cloudinary from '../../utils/cloudinary.js';
import subCategoryModel from '../../../DB/model/SubCategoryModel.js';

const createCategory = async (req, res, nxt) => {
    const { name } = req.body;
    const slug = slugify(name,'-')

    const existCategory = await categoryModel.findOne({ name })
    if (existCategory)return nxt(new Error("category exist ,please chosse another name", { cause: 400 }))

    const customId=nanoid(5);
    const{secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{
        folder:`${process.env.PICTURES_FOLDER}/Categories/${customId}`
    })
    const category=await categoryModel.create({
        name:name,
        slug,
        customId,
        image:{
            path:secure_url,
            public_id
        },
        createdBy: req.user._id
    });
    if(!category){
        await cloudinary.uploader.destroy(public_id)
        return nxt (new Error("fail to create category ,please try again",{cause:400}))
    }
    res.status(201).json({message:`category ${name} created successfully`})
}
const updateCategory=async(req,res,nxt)=>{
    const { categoryId}=req.params;

    const category=await categoryModel.findById(categoryId)
    if(! category)return nxt(new Error("category not exist",{cause:404}))

    if(req.body.name){
        if(category.name==req.body.name) return nxt(new Error("category exist,please select another name"))

        const existCategory=await categoryModel.findOne({name:req.body.name})
        if(existCategory) return nxt(new Error("category exist,please select another name",{cause:400}))

        category.name=req.body.name;
        category.slug=slugify(req.body.name,'-')
    }
    if(req.file){
        await cloudinary.uploader.destroy(category.image.public_id)
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{
            folder:`${process.env.PICTURES_FOLDER}/Categories/${category.customId}`
        })
        category.image={
            path:secure_url,
            public_id
        }
    }
    if (!Object.keys(req.body).length) return nxt(new Error('please enter the updated fields', { cause: 400 }))

    category.updatedBy = req.user._id
    const updatedCategory=await category.save();
    return res.status(200).json({message:"updated done",updatedCategory})
}



const getAllCategories=async(req,res,nxt)=>{

    
    const categories =await categoryModel.find({}).populate({
        path:'subCategories',
        select:'name image -_id'
    })
    if(!categories.length)return res.status(200).json({message:"there are no categories to show"})
    return res.status(200).json({message:"done",categories})
}
export{
    createCategory,
    updateCategory,
    getAllCategories
}