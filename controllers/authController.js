const { body, validationResult } = require('express-validator');
const UserModel = require('../Models/User');
const OtpModel = require('../Models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JET = process.env.JWT_SECRET;
const ElasticEmail = require('@elasticemail/elasticemail-client');
const defaultClient = ElasticEmail.ApiClient.instance;
let apikey = defaultClient.authentications['apikey'];
apikey.apiKey = process.env.ELASTIC_EMAIL_API_KEY;
const directories = `${process.cwd()}/templates/`;
const ejs = require('ejs');
const helper = require('../utils/helper'); 
 
let api = new ElasticEmail.EmailsApi()


const createUser = async(req,res)=>{
    try{
        const errors = validationResult(req);
        // console.log("Errors",errors)
        if (!errors.isEmpty()) {
            throw{
                message:"Please enter valid data"
            }
        }

        let user = await UserModel.findOne({email:req.body.email})

        if(user){
            throw{
                message:"User already exists"
            }
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

        jwtOptions = { expiresIn: '720h' }

        let authToken = jwt.sign(data,JET,jwtOptions);

        let jwtUserResponse = await UserModel.findByIdAndUpdate(user._id,{token:authToken},{new:true});

        delete jwtUserResponse.token;

        res.status(200).json({
            status:true,
            data:jwtUserResponse,
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
        let {email,password}=req.body;
        if(!email || !password){
            res.status(401).json({
                status:false,
                statusCode:401,
                message:"Invalid email and password provided"
            })
        }
        let user = await UserModel.findOne({email});

        if(!user){
            throw{
                message:"Email is not registered."
            }
          }

        let passwordCompare = await bcrypt.compare(password,user.password)
        if(!passwordCompare){
            throw { message: "Wrong Credentials" };
        }
        let data ={
            user:{
                id:user._id,
                email: user.email,
            }
        }

        jwtOptions = { expiresIn: '720h' }

        let authToken = jwt.sign(data,JET,jwtOptions);
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



const forgotPassWord = async(req,res)=>{
    try{
        const data = req.body;

        const userResponse  = await UserModel.findOne({email:data.email});

        if(!userResponse){
            throw{
                message:"User with this email does not exist."
            }
        }

        let otpValue = await helper.generateOTP(userResponse._id)

        const sendemail = await ejs.renderFile(directories + "forgotPassword.ejs", { data: { userName: userResponse.name, otp:otpValue } });

        let email = ElasticEmail.EmailMessageData.constructFromObject({
            Recipients: [
              new ElasticEmail.EmailRecipient(userResponse.email)
            ],
            Content: {
              Body: [
                ElasticEmail.BodyPart.constructFromObject({
                  ContentType: "HTML",
                  Content: sendemail
                })
              ],
              Subject: "Reset password otp.",
              From: process.env.SENDER_EMAIL,
            }
          });

          const callback = function(error, data, response) {
            if (error) {
              console.error(error);
            } else {
              console.log('Email sent successfully.');
            }
          };
          api.emailsPost(email, callback)

  
        res.status(200).json({
            status:true,
            statusCode:200,
            message:"Otp is sent to your email",
            data:null,
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

const resetPassword = async(req,res)=>{
    try{
        const data = req.body;

        const userResponse  = await UserModel.findOne({email:data.email});

        if(!userResponse){
            throw{
                message:"User with this email does not exist."
            }
        }

        console.log(data)
        const salt = await bcrypt.genSalt(10);
        data.newPassword = await bcrypt.hash(data.confirmPassword, salt);

        const MS_PER_MINUTE = 60000;
        const createdAt = new Date(new Date().getTime() - 15 * MS_PER_MINUTE);
        let compareOtp = await OtpModel.findOne({ code: data.otp, userId: userResponse._id, isDeleted: false, updatedAt: { $gte: createdAt } })
        
        if (!compareOtp) {
            throw { message: "Invalid otp. Please try again." };
        }

        await OtpModel.findOneAndUpdate({ userId: userResponse._id }, { isDeleted: true });
        const updatedUser = await UserModel.findOneAndUpdate({email:data.email},{password:data.newPassword},{new:true});
        
        res.status(200).json({
            status:true,
            statusCode:200,
            message:"Password reset successfully.",
            data:null,
        })
    }catch(err){
        console.log(err)
        res.status(400).json({
            status:false,
            statusCode:400,
            message:err.message,
            error:err,
        })
    }

}


module.exports = {
    createUser,
    login,
    forgotPassWord,
    resetPassword,
}