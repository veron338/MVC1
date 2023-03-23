import UserModel from "../modules/User/User.model.js"

export default async (req, res, next)=>{
    const {username} = req.decodedToken

    const user = await UserModel.findOne({username},{_id:0, admin:1})

    req.isAdmin = !!user?.admin // true false

    // !!undefined  
    // !undefined -> !true -> false
    // !!undefined -> false 
    // !!null -> false 
    // !!{} -> true 
    // !![] -> true 
    // !!"adsaasdasd" -> true 

    if(!req.isAdmin){//Si no es admin 
        return res.status(403).json({error:true, errMsg: "The 'admin' role is required"})
    }

    next()
}