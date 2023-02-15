const { body, validationResult } = require('express-validator');
const UserModel = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JET = process.env.JWT_SECRET;


const createUser = async(req,res)=>{
    try{
        console.log("came here")
        const errors = validationResult(req);
        // console.log("Errors",errors)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let user = await UserModel.findOne({email:req.body.email})

        if(user){
            res.status(501).json({
                status: false,
                message: "User already exists",
                data: null,
            });
        }

        let salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(req.body.password,salt)
        user = await UserModel.create({
            email:req.body.email,
            name:req.body.name,
            password:secPass,
        })

        let data ={
            id:user._id,
            email: user.email,
        };

        let authToken = jwt.sign(data,JET);

        let jwtUserResponse = await UserModel.findByIdAndUpdate(user._id,{token:authToken},{new:true});

        delete jwtUserResponse.token;

        res.status(200).json({
            status:true,
            response:jwtUserResponse,
            message:"User created successfully"
        })

    }catch(err){
        console.log("Error",err)
        res.status(500).json({
            status: false,
            message: err.message,
            data: err,
        });
    }

}

const login = async(req,res)=>{
    try{
        let {email,password}=req.body
        if(!email || !password){
            res.status(401).json({
                status:false,
                statusCode:401,
                message:"Invalid email and password provided"
            })
        }
        let user = await UserModel.findOne({email})
        if(!user){
            res.status.send(501).error({error:"Not a valid user please login with correct credentials"})
        }
        let passwordCompare = await bcrypt.compare(password,user.password)
        if(!passwordCompare){
            res.status.send(501).error({error:"Unauthorized user please login with correct credentials"})
        }
        let data ={
            user:{
                id:user._id,
                email: user.email,
            }
        }
        let authToken = jwt.sign(data,JET);
        let jwtUserResponse = await UserModel.findOneAndUpdate({_id:user._id},{token:authToken},{new:true});

        delete jwtUserResponse.token;

        res.status(200).json({
            status:true,
            statusCode:200,
            message:"Login Successful",
            data:jwtUserResponse,
        })
    }catch(err){
        res.status(400).json({
            status:false,
            statusCode:400,
            message:err.message,
            error:err,
        })
    }

}


const getUser = async(req,res)=>{
    let userId = await req.user.id;
    let user = await user.findById(userId).select("-password");
    res.send({user})
}


module.exports = {
    createUser,
    login,
    getUser,
}