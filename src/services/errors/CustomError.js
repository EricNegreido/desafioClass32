export default class CustomError{
    static createError({ name="Error" , cause="Undefined", message, code= 0}){
        const error = new Error(message, {cause});
        error.name = name;
        error.code = code;
        return error;
    }
}