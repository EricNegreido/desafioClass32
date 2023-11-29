import { fileURLToPath } from "url";
import { dirname } from "path";
import {fakerES as faker} from '@faker-js/faker';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generateProduct = () =>{
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int({min: 0, max: 20})
    }
}

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10));
export const isValidPassword = (password, userPassword) => bcrypt.compareSync(password, userPassword);
export default __dirname;
export { generateProduct};