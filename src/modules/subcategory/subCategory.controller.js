
import slugify from 'slugify'
import { nanoid } from 'nanoid';
import cloudinary from '../../utils/cloudinary.js';
import subCategoryModel from '../../../DB/model/SubCategoryModel.js';
import categoryModel from '../../../DB/model/CategoryModel.js';

const createSubCategory = async (req, res, nxt) => {
    const { name } = req.body;
    const { categoryId } = req.params;
    const slug = slugify(name, '-')

    const existSubCategory = await subCategoryModel.findOne({ name })
    if (existSubCategory) return nxt(new Error("SubCategory exist ,please chosse another name", { cause: 400 }))

    const existCategory = await categoryModel.findById(categoryId)
    if (!existCategory) return nxt(new Error("category not found", { cause: 404 }))

    const customId = nanoid(5);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PICTURES_FOLDER}/Categories/${existCategory.customId}/subCategories/${customId}`
    })
    const subCategory = await subCategoryModel.create({
        name,
        slug,
        customId,
        image: {
            path: secure_url,
            public_id
        },
        categoryId,
        createdBy: req.user._id
    });
    if (!subCategory) {
        await cloudinary.uploader.destroy(public_id)
        
        return nxt(new Error("fail to create subCategory ,please try again", { cause: 400 }))
    }
    res.status(201).json({ message: `subCategory ${name} created successfully` })
}
const updateSubCategory = async (req, res, nxt) => {
    const { subCategoryId,categoryId } = req.params;
    const category = await categoryModel.findById(categoryId)
    if (!category) return nxt(new Error("Category not exist", { cause: 404 }))

    const subCategory = await subCategoryModel.findById(subCategoryId)
    if (!subCategory) return nxt(new Error("subCategory not exist", { cause: 404 }))

    if (req.body.name) {
        if (subCategory.name == req.body.name) return nxt(new Error("subCategory exist,please select another name"))

        const existSubCategory = await subCategoryModel.findOne({ name: req.body.name })
        if (existSubCategory) return nxt(new Error("subCategory exist,please select another name", { cause: 400 }))

        subCategory.name = req.body.name;
        subCategory.slug = slugify(req.body.name, '-')
    }
    if (req.file) {
        await cloudinary.uploader.destroy(subCategory.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.PICTURES_FOLDER}/Categories/${category.customId}/subCategories/${subCategory.customId}`
        })
        subCategory.image = {
            path: secure_url,
            public_id
        }
    }
    if (!Object.keys(req.body).length && !req.file) return nxt(new Error('please enter the updated fields', { cause: 400 }))

    subCategory.updatedBy = req.user._id
    const updatedSubCategory = await subCategory.save();
    return res.status(200).json({ message: "updated done", updatedSubCategory })
}
const getAllSubCategories = async (req, res, nxt) => {


    const subCategories = await subCategoryModel.find({}).populate({
        path: 'categoryId',
        select: 'name image'
    })
    if (!subCategories.length) return res.status(200).json({ message: "there are no subCategories to show" })
    return res.status(200).json({ message: "done", subCategories })
}
export {
    createSubCategory,
    updateSubCategory,
    getAllSubCategories
}