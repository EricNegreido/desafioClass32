import {cartsModel} from './models/carts.models.js';

export default class Carts {
    constructor(){
        console.log("Working carts with DB dbManager");
    }

    getArray= async (cid) => {
    
        const carts = await cartsModel.findById({_id: cid}).lean().populate('products.product'); // Con .lean() convertimos a un objetos manipulable en java
        return carts;

    }
    save = async () => {
        const result = await cartsModel.create({products:[]});
        return result;
    }

    update = async (id, products) => {
    
        const result = await cartsModel.updateOne({_id: id},{products: products});
        console.log(result)

        return result
    }
    
    
}



