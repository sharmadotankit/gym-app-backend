const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JET = process.env.JWT_SECRET;



// Endpoint to create a user =============================================================================
router.post('/createuser',[
    body('name','Name must be at least 3 characters').isLength({ min: 3 }),
    body('email','Email must be a valid email').isEmail(),
    body('password','Password must be at least 5 characters').isLength({ min: 5 }),
],async(req,res)=>{
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({email:req.body.email})
    if(user){
        res.status.send(501).error({error:"Not a valid user please login with correct credentials"})
    }
    let salt = await bcrypt.genSalt(10);
    let secPass = await bcrypt.hash(req.body.password,salt)
     user = await User.create({
        email:req.body.email,
        name:req.body.name,
        password:secPass,
       
    })
   
    let data ={
        user:{
            id:user.id
        }
    }
    let authToken = jwt.sign(data,JET)
    res.send({authToken})
})

//Endpoint to login a user /no login -required==============================================================
router.post('/login',[
    body('email','Email must be a valid email').isEmail(),
    body('password','Password must be at least 5 characters').isLength({ min: 5 }),
],async(req,res)=>{
    let {email,password}=req.body
    let user = await User.findOne({email})
    if(!user){
        res.status.send(501).error({error:"Not a valid user please login with correct credentials"})
    }
    let passwordComapre = await bcrypt.compare(password,user.password)
    if(!passwordComapre){
        res.status.send(501).error({error:"Unauthorize user please login with correct credentials"})
    }
     let data ={
        user:{
            id:user.id
        }
    }
    let authToken = jwt.sign(data,JET)
    res.send({authToken})
})

//Endpoint to get a user /login required========================================================================
router.get('/getuser',fetchuser,async(req,res)=>{
    let userId = await req.user.id
    let user = await user.findById(userId).select("-password");
    res.send({user})
})


module.exports = router;