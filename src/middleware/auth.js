

import userModel from "../../DB/model/User.model.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";



const auth =  (accessRoles) => {

    return  async(req,res,next) =>{
        try {
            const { authorization } = req.headers;
           
            if (!authorization?.startsWith(process.env.BEARER_KEY)) {
              
                return next(new Error('In-valid bearer key',{cause:400}))

            }
            const token = authorization.split(process.env.BEARER_KEY)[1]
          
            if (!token) {
          
                return next(new Error('In-valid token',{cause:400}))
            }
    
            const decoded = verifyToken({token})
            if (!decoded?.id) {
         
                return next(new Error('In-valid token payload',{cause:400}))

            }
            const authUser = await userModel.findById(decoded.id).select('userName email role')
            if (!authUser) {
             
                return next(new Error('Not register account',{cause:400}))

            }
            if (decoded.iat < authUser.changePassword/1000) {
                return next(new Error('token expired please log in again',{cause:400}))
                
            }
            if (accessRoles) {
                if (!accessRoles.includes(authUser.role)) {
                    return next(new Error('Not authorized',{cause:400}))
                    
                }
            }
           

            req.user = authUser;
            return next()
        } catch (error) {
            return res.json({ message: "Catch error in auth" , err:error?.message })

        }
    }
   
}

export default auth