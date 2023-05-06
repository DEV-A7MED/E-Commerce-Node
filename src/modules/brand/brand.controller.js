import { nanoid } from "nanoid";
import brandModel from "../../../DB/model/BrandModel.js";
import subCategoryModel from "../../../DB/model/SubCategoryModel.js";
import cloudinary from "../../utils/cloudinary.js";
import categoryModel from "../../../DB/model/CategoryModel.js";


const addBrand = async (req, res, nxt) => {
    const { name } = req.body;
    const { subCategoryId,categoryId } = req.params;
    
    const catergory = await categoryModel.findOne({ _id: categoryId })

    const existSubCat = await subCategoryModel.findById(subCategoryId);
    if (!existSubCat) return nxt(new Error("subCategory not exist", { cause: 404 }));

    const existBrand = await brandModel.findOne({ name, subCategoryId });
    if (existBrand) return nxt(new Error("brand Exist", { cause: 400 }));

    const customId = nanoid(5);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PICTURES_FOLDER}/Categories/${catergory.customId}/subCategories/${existSubCat.customId}/Brands/${customId}`
    });
    const brand = await brandModel.create({
        name,
        subCategoryId,
        logo: {
            path: secure_url,
            public_id
        },
        customId,
        createdBy: req.user._id
    })
    if (!brand) return nxt(new Error("FAIL TO CREATE BRAND", { cause: 400 }));
    return res.status(201).json({ message: "create brand done", brand })
}

export{
    addBrand,

}