import {CartDto} from '../DTOs/dto.js'
import Errors from '../middleware/errors/enums.js';
import CustomError from '../middleware/errors/CustomError.js';
import { generateNotFoundInfo } from '../middleware/errors/info.js';

export default class CartsRepository {
    constructor(dao){
        this.dao = dao;

    }

    getCart= async (cid) => {
        const result = await this.dao.getArray(cid);

        // const obtained = new CartDto(result);
        return result;
    }
    createCart = async () => {
        const result = await this.dao.save();
        return result;
    }

    updateCart = async (id, product) => {
    console.log(product)

        const result = await this.dao.update(id, product);
        return result
    }
    
}