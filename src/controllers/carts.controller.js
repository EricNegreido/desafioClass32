import { getCartService, updateCartService, addCartService } from '../services/carts.services.js';
import { getProductIdService } from '../services/products.services.js';
import { ticketService } from '../services/ticket.services.js';
import { generateNotFoundInfo } from '../services/errors/info.js';
import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';

const getCart = async (req, res) => {

    const {cid} = req.params;
   
    try{
        const carts = await getCartService(cid) ;
        if(!carts){
            throw CustomError.createError({
                name:'Cart Not found',
                cause: generateNotFoundInfo(cid),
                message:'Cart Not found',
                code:EErrors.CART_NOT_FOUND
                
        });

        }else{
            console.log(carts);
            res.send({status: 'sucess', payload: carts});           
        }

    }
    catch(error){
        throw error
    }

};

const addCartProduct = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;

        const cart = await getCartService(cid)
        const product = await getProductIdService(pid);

        if(cart && product){

                
                const existingProduct = cart.products.find(item => item.product._id === pid);
                if (existingProduct) {
                    existingProduct.quantity += quantity || 1;
                } else {
                    cart.products.push({ product: pid, quantity: quantity || 1 });
                }
        }else{
            throw CustomError.createError({
                name: cart ? 'Product Not found' : 'Cart Not found',
                cause: cart ? generateNotFoundInfo(pid) : generateNotFoundInfo(cid),
                message:cart ? 'Product Not found' : 'Cart Not found',
                code:EErrors.RESOURCE_NOT_FOUND
            });
        }

    const result = await updateCartService(cid, cart.products);
    ///PROBLEMAS AL GUARDAR
    res.status(201).send({status: 'sucess', payload: result}); 


    } catch (error) {
        throw error

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
        }else{
            throw CustomError.createError({
                name: cart ? 'Product Not found' : 'Cart Not found',
                cause: cart ? generateNotFoundInfo(pid) : generateNotFoundInfo(cid),
                message:cart ? 'Product Not found' : 'Cart Not found',
                code:EErrors.RESOURCE_NOT_FOUND
            });
        }


    const result = await updateCartService(cid, cart.products);
    
    res.status(201).send({status: 'sucess', payload: result}); 


    } catch (error) {
        throw error

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
            throw CustomError.createError({
                name: cart ? 'Product Not found' : 'Cart Not found',
                cause: cart ? generateNotFoundInfo(pid) : generateNotFoundInfo(cid),
                message:cart ? 'Product Not found' : 'Cart Not found',
                code:EErrors.RESOURCE_NOT_FOUND
            });
        }
        

    } catch (error) {
        throw error
    }
};

const addCart = async (req, res) =>{
    
    try{
        const result = await addCartService();
        res.status(201).send({status: 'sucess', payload: result}); 

    }catch(error){
        throw error
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
        throw error
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
        throw error
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