import { UserDto } from "../DTOs/dto.js";

//LOGIN
const authLogin =  async (req, res) => {
    
    if(!req.user)
        return res.status(401).send({status: 'error', message: 'incorrect credentials'});

    const user = new UserDto(req.user);
    req.session.user = user
    res.send({status: 'success', message: 'login success'})
};

const failLogin = async (req, res) => {
    res.status(500).send({status: 'error', message:'login fail'})
 };


const logout = (req, res) =>{
    req.session.destroy(error => {
        if(error) return res.status(500).send({status:'error', error});
        res.redirect('/');
    })
};


//GIT HUB AUTH
const githubAuth = async(req, res) =>{
    res.send({status: 'success', message: 'user registered'});
};
const githubLogin = async(req, res) =>{
    const user = new UserDto(req.user);
    req.session.user = user;
    res.redirect('/');
};

//REGISTER
const register = async (req, res) => {

    res.send({ status: 'success', message:' user registered'})
};

const failRegister =  async (req, res) => {
    res.status(500).send({status: 'error', message:'register fail'})
 };

export{
    authLogin,
    logout,
    failLogin,
    githubAuth,
    githubLogin,
    register,
    failRegister
}
