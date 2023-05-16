


import userModel from "../../DB/model/UserModel.js";
import { decodeToken } from "../utils/GenerateAndVerifyToken.js";
import { systemRoles } from "../utils/systemRoles.js";



const auth = (accessRoles) => {
    return async (req, res, nxt) => {
        try {
            if (!accessRoles) {
                accessRoles = [systemRoles.USER, systemRoles.ADMIN, systemRoles.SUPER_ADMIN]
            }
            const { authorization } = req.headers;
        // access it from validation
            // if (!authorization) return nxt(new Error("please login first", { cause: 400 }))
            
            if (!authorization?.startsWith(process.env.BEARER_KEY)) return nxt(new Error("In-valid bearer key", { cause: 400 }))
            
            const token = authorization.split(process.env.BEARER_KEY)[1]
            if (!token) return nxt(new Error("In-valid token", { cause: 400 }))
            
            const decoded = decodeToken({ payload: token })
            if (!decoded?._id) return nxt(new Error("In-valid token payload", { cause: 400 }))

            const authUser = await userModel.findById(decoded._id).select('userName email role changePasswordDate')
            if (!authUser) return nxt(new Error("Not register account"), { cause: 400 })
            
            if (decoded.iat < authUser.changePasswordDate / 1000) return nxt(new Error("token expired"), { cause: 400 })
            
            // authorization 
            if (!accessRoles.includes(authUser.role)) return nxt(new Error("Un-Authorized User"), { cause: 400 })
            
            req.user = authUser;
            return nxt()
        } catch (error) {
            return res.json({ message: "Catch error", err: error?.message })
        }
    }
}
export const authGraphQl = async(authorization,accessRoles) => {
    
    try {
        if (!accessRoles) {
            accessRoles = [systemRoles.USER, systemRoles.ADMIN, systemRoles.SUPER_ADMIN]
        }
    
    // access it from validation
        if (!authorization) throw new Error('please login first')
        
        if (!authorization?.startsWith(process.env.BEARER_KEY)) throw new Error('In-valid bearer key')
        
        const token = authorization.split(process.env.BEARER_KEY)[1]
        if (!token) throw new Error('In-valid token')
        
        const decoded = decodeToken({ payload: token })
        if (!decoded?._id) throw new Error('In-valid token payload')

        const authUser = await userModel.findById(decoded._id).select('userName email role changePasswordDate')
        if (!authUser) throw new Error('Not register account')

        
        if (decoded.iat < authUser.changePasswordDate / 1000) throw new Error('token expired')
        // authorization 
        if (!accessRoles.includes(authUser.role)) throw new Error('Un-Authorized User')
        
        return authUser
    } catch (error) {
        throw new Error(error)
    }
    
}
export default auth

