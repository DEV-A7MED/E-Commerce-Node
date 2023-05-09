import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const signUpSchema=joi.object({
    userName:joi.string().min(3).max(15).alphanum().required(),
    email:generalFields.email,
    password:generalFields.password,
    cPass:generalFields.cPassword,
    phone:joi.number(),
    DOB:joi.string(),
    file:generalFields.file.required(),
    
}).required();

export const logInSchema = joi.object({
    email: generalFields.email,
    password: generalFields.password,

}).required()