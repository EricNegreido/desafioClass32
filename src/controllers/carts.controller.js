import { getCartService, updateCartService, addCartService } from '../services/carts.services.js';
import { getProductIdService, updateProductService } from '../services/products.services.js';
import { ticketService } from '../services/ticket.services.js';
import { updateProduct } from './products.controller.js';
import { generateNotFoundInfo } from '../middleware/errors/info.js';
import Errors from '../middleware/errors/enums.js';
import CustomError from '../middleware/errors/CustomError.js';

const getCart = async (req, res) => {

    const {cid} = req.params;
   
    try{
        const carts = await getCartService(cid);

        if(!carts){
             throw CustomError.createError({
                name:'Cart Not found',
                cause: generateNotFoundInfo(cid),
                message:'Cart Not found',
                code:Errors.CART_NOT_FOUND
        });
        }else{
            res.send({status: 'sucess', payload: carts});           
        }

    }
    catch(error){
        res.status(500).send({status: 'error', error: error.message})
        
    }

};

const addCartProduct = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;

        const cart = await getCartService(cid)
        const product = await getProductIdService(pid);

        if(cart){

            if (product) {
            console.log(cart.products)
                
                const existingProduct = cart.products.find(item => item.product._id === pid);
                console.log(existingProduct)
                if (existingProduct) {
                    existingProduct.quantity += quantity || 1;
                    console.log(quantity)
                } else {
                    console.log(quantity)

                    cart.products.push({ product: pid, quantity: quantity || 1 });
                    console.log(cart.products)
                }
            
        }

     }


    const result = await updateCartService(cid, cart.products);
    ///PROBLEMAS AL GUARDAR
    res.status(201).send({status: 'sucess', payload: result}); 


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ERROR AL AGREGAR EL PRODUCTO' });
    }
};

// ARREGLAR QUANTITY

const updateCartProduct =  async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;

        const cart = await getCartService(cid)
        const product = await getProductIdService(pid);


        if(cart && product){

            const existingProduct = cart.products.find(item => item.id === pid);
            if (existingProduct) {

                existingProduct.quantity += quantity || 1;
            }

     }


    const result = await updateCartService(cid, cart.products);
    
    res.status(201).send({status: 'sucess', payload: result}); 


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ERROR AL AGREGAR EL PRODUCTO' });
    }
};

const deleteCartProduct = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const cart = await getCartService(cid)
        const product = await getProductIdService(pid);


        if(cart && product){

            cart.products = cart.products.filter(item => item.id !== pid);
            const result = await updateCartService(cid, cart.products);
            
            res.status(201).send({status: 'sucess', payload: result}); 
        }else{
            res.status(404).json({ error: 'NO SE ENCONTRO PRODUCTO O CARRITO' });
        }
        

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ERROR AL ELIMINAR EL PRODUCTO' });
    }
};

const addCart = async (req, res) =>{
    
    try{
        const result = await addCartService();
        res.status(201).send({status: 'sucess', payload: result}); 

    }catch(error){
        res.status(500).send({status: 'error', error: error.message})
    }
};

const cartPurchaser = async(req,res) => {
    const {cid} = req.params;
    try{
        const carts = await getCartService(cid);
        const cartProducts = carts.products

        const buyCart = cartProducts.filter(elem => elem.stock >= elem.quantity);
        // const notBuyCart = carts.products.filter(elem => elem.stock < elem.quantity);

        let total = 0;
        buyCart.forEach(elem => { total = elem.price + total})

        const ticket = ticketService(total)
        res.send({status: 'sucess', payload: ticket});
    }catch(error){
        res.status(500).send({status: 'error', error: error.message})
    }
};


const deleteCart = async (req, res) => {
    try {
        const cid = req.params.cid;

        const cart = await getCartService(cid)

        if(cart){

            cart.products = [];
            const result = await updateCartService(cid, cart.products);
            
            res.status(201).send({status: 'sucess', payload: result}); 
        }else{
            res.status(404).json({ error: 'NO SE ENCONTRO PRODUCTO O CARRITO' });
        }
        

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ERROR AL ELIMINAR EL PRODUCTO' });
    }
};


export {
    getCart,
    addCartProduct,
    updateCartProduct,
    addCart,
    deleteCartProduct,
    deleteCart,
    cartPurchaser
}