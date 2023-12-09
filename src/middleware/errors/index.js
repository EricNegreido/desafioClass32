import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) => {
    console.log(`CAUSA: ${error.cause}`);
    console.log(`ERROR: ${error.code}`);
    switch(error.code){
        case EErrors.INVALID_TYPE_ERROR:
            res.status(400).send({
                status:'error',
                error:error.name,
                message: error.message

            })
            break;
        case EErrors.RESOURCE_NOT_FOUND:
            res.status(404).send({
                status:'error',
                error:error.name,
                message: error.message

            })
            break;
        default:
            res.status(500).send({
                status:'error',
                error:error.name,
                message: error.message
            })
    }
}