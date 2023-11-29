import {ticketService} from '../services/ticket.services.js'

const generateTicket = async(req, res) => {

    try {
        const {amount, purchaser} = req.body;
        const result = await ticketService(amount,purchaser);
        res.status(201).send({status: 'sucess', payload: result}); 

    } catch (error) {
        console.error('Error generating ticket:', error);
        res.status(500).send({status: 'error', error: error.message})

    }
   

}

export default generateTicket;