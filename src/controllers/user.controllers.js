const catchError = require('../utils/catchError');
const User = require('../models/User');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const Post = require('../models/Post');


const getAll = catchError(async(req, res) => {
    const results = await User.findAll({include:[Post]});
    return res.json(results);
});

const create = catchError(async(req, res) => {
    //encryptacion de contraseña
    const { password } = req.body;
    const hashPassword = bcrypt.hashSync(password, 10);

    const result = await User.create({...req.body, password:hashPassword});

    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.destroy({ where: {id} });
    if(!result) return res.sendStatus(404);
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    //Impedir actualización de contraseña
    const deleteFields =['password','email']

    deleteFields.forEach(field => delete req.body[field])


    
    


    const result = await User.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const login = catchError(async(req,res)=>{

    const {email, password} = req.body;

    const user = await User.findOne({where:{email}});

    if(!user) return res.status(401).json({message:'invalid credentials'})

    const isValid = bcrypt.compareSync(password, user.password);

    if(!isValid) return res.status(401).json({message:'invalid credentials'})

        const token = jwt.sign(
            {user},
         process.env.TOKEN_SECRET,
         {expiresIn:'1d'}
        )
    
        return res.status(200).json({user,token})

})

const logged = catchError(async(req,res)=>{
    const user = req.user
    return res.json(user)
    
        

})


module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login,
    logged
}