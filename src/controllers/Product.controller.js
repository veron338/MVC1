import ProductModel from "./Product.model.js"

export const getAll = async (req, res) => {
    const match = req.query
    try{
        const products = await ProductModel.find(match)
        res.json(products)
    }
    catch(e){

    }
}


export const getById = async (req, res) => {
    try{
        const {_id} = req.params
        const product = await ProductModel.findOne({ _id })
     
        res.json(product||{})
    }
    catch(e){
        res.json(e)
    }
}


export const create =  async (req, res) => {
    //console.log(req.body)
    try{
        const {body} = req
        const {brand, model, price, category} = body
        if( !brand || !model || !price || !category  ){
            res.json({error: true, errorMsg: "Faltan Datos"})
            return
        }

        const product = await ProductModel.create(body)

        res.json( product )
    }
    catch(e){
        res.json(e)
        console.log(e)
    }
}


export const update = async (req, res) => {
    try{
        const {_id} = req.params
        const {body} = req

        const response = await ProductModel.updateOne({_id},body)

        if(response.matchedCount){
            const product = await ProductModel.findOne({_id})
            res.json( product )
        }
        else{
            res.json({error:true, errorMsg: "Registro no encontrado: _id"+_id})
        }

    }
    catch(e){
        res.json(e)
        console.log(e)
    }
}


export const resave = async (req, res) => {
    try{
        const {_id} = req.params
        const {body} = req
        const {brand, model, price, category} = body
        if( !brand || !model || !price || !category  ){
            res.json({error: true, errorMsg: "Faltan Datos"})
            return
        }

        const response = await ProductModel.updateOne({_id},body)

        if(response.matchedCount){
            const product = await ProductModel.findOne({_id})
            res.json( product )
        }
        else{
            res.json({error:true, errorMsg: "Registro no encontrado: _id"+_id})
        }
    }
    catch(e){
        res.json(e)
        console.log(e)
    }
}


export const deleteOne = async (req, res) => {
    try{
        const {_id} = req.params
        const response = await ProductModel.deleteOne({ _id })
     
        res.json(response||{})
    }
    catch(e){
        res.json(e)
    }
}