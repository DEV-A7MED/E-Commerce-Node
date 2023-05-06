import { nanoid } from "nanoid"
import slugify from "slugify"
import categoryModel from "../../../DB/model/CategoryModel.js"
import subCategoryModel from "../../../DB/model/SubCategoryModel.js"
import brandModel from "../../../DB/model/BrandModel.js"
import cloudinary from "../../utils/cloudinary.js"
import productModel from "../../../DB/model/ProductModel.js"
import ApiFeatures from "../../utils/apiFeatures.js"


const adProduct = async (req, res, nxt) => {
    // IDs
    const { categoryId, subCategoryId, brandId, name, price, discount } = req.body
    const Category = await categoryModel.findById(categoryId)
    const subCategory = await subCategoryModel.findOne({ _id: subCategoryId, categoryId })
    const brand = await brandModel.findOne({ _id: brandId, subCategoryId })
    if (!Category || !subCategory || !brand) {
        return nxt(new Error('in-valid ids', { cause: 400 }))
    }
    // createdBy
    req.body.createdBy = req.user._id
    // name
    req.body.slug = slugify(name, {
        replacment: '_',
        lower: true
    })

    // prices 
    req.body.priceAfterDiscount = price * (1 - ((discount || 0) / 100))
    // mainImages

    const customId = nanoid(5)
    req.body.customId = customId
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, {
                folder: `${process.env.PICTURES_FOLDER}/Categories/${Category.customId}/subCategories/${subCategory.customId}/Brands/${brand.customId}/Products/${customId}`

    })
    req.body.mainImage = {
        path: secure_url,
        public_id
    }
    // subImages
    if (req.files.subImages) {
        req.body.subImgaes = []
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                folder: `${process.env.PICTURES_FOLDER}/Categories/${Category.customId}/subCategories/${subCategory.customId}/Brands/${brand.customId}/Products/${customId}`
            })
            req.body.subImgaes.push({
                path: secure_url,
                public_id
            })
        }
    }

    const product = await productModel.create(req.body)
    if (!product) {
        // destory
        await cloudinary.api.delete_folder(`${process.env.PICTURES_FOLDER}/Categories/${Category.customId}/subCategories/${subCategory.customId}/Brands/${brand.customId}/Products/${customId}`)
        return nxt(new Error('fail', { cause: 500 }))
    }
    return res.status(201).json({ message: "Done", product })

}

const updateProduct = async (req, res, nxt) => {
    const { productId } = req.params
    const product = await productModel.findById(productId)
    if (!product) return nxt(new Error('in-valid productId', { cause: 400 }))

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
    } 
    else if (price || discount) {
        req.body.priceAfterDiscount = (price || product.price) * (1 - ((discount || product.discount) / 100))
    }
    const Category = await categoryModel.findById(product.categoryId)
    const subCategory = await subCategoryModel.findOne({ _id: product.subCategoryId, categoryId: product.categoryId })
    const brand = await brandModel.findOne({ _id: product.brandId, subCategoryId: product.subCategoryId })
    // mainImage
    if (req.files?.mainImage?.length) {
        await cloudinary.uploader.destroy(product.mainImage.public_id)

        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, {
            folder: `${process.env.PICTURES_FOLDER}/Categories/${Category.customId}/subCategories/${subCategory.customId}/Brands/${brand.customId}/Products/${product.customId}`
        })
        req.body.mainImage = {
            path: secure_url,
            public_id
        }
    }

    // subImages
    if (req.files?.subImages?.length) {
        let publicIds=[]
        for (const file of product.subImgaes) {
            publicIds.push(file.public_id)
            // console.log(publicIds);
            await cloudinary.api.delete_resources(publicIds)
        }
        req.body.subImgaes = []
        for (const file of req.files.subImages) {
            
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                folder: `${process.env.PICTURES_FOLDER}/Categories/${Category.customId}/subCategories/${subCategory.customId}/Brands/${brand.customId}/Products/${product.customId}`
            })
            req.body.subImgaes.push({
                path: secure_url,
                public_id
            })
            

        }
    }

    req.body.updatedBy = req.user._id
    const savedProduct = await productModel.findByIdAndUpdate(productId, req.body, { new: true })
    if (!savedProduct) {
        return nxt(new Error('in-valid procustId fail to update', { cause: 400 }))
    }
    res.status(200).json({ message: "Done", savedProduct })

}
const productList = async (req, res, nxt) => {
    //ApiFeatures class
    const apiFeature = new ApiFeatures(productModel.find(), req.query)
    .paginate()
    .sort()
    .select()
    .search()
    .filters()
    const products = await apiFeature.mongooseQuery
    res.status(200).json({ message: 'Done', products })
    

}
export{
    adProduct,
    updateProduct,
    productList
}
