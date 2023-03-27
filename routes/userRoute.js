const express=require("express")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { userModel } = require("../models/usersModel")
const userRoute=express.Router()
const jwt=require("jsonwebtoken")


userRoute.post("/register", async(req,res)=>{
    const {email,password}=req.body
   
    const user=await userModel.find({email:email})

    if(user.length!==0){
        res.status(400).send("User already exist, please login")
        return
    }
    bcrypt.hash(password, saltRounds, async function(err, hash) {
        if(err){
            return  res.send({msg:err.message})
           
        }
        let newUser=new userModel({...req.body,password:hash})
        await newUser.save()
        res.send("New User Registered")
    });
   
})


userRoute.post("/login",async(req,res)=>{
    const {email,password}=req.body
   
    const user=await userModel.find({email:email})

    if(user.length==0){
        return res.status(404).send("You are not registered")
    }

    let hash=user[0].password
    bcrypt.compare(password, hash, function(err, result) {
        if(err){
            return  res.send({msg:err.message})
           
        }

        if(result){
           return  res.json({
            name:user[0].name,
            email:user[0].email,
            gender:user[0].gender,
            age:user[0].age,
            city:user[0].city,
            is_married:user[0].is_married,
       
              token:jwt.sign({userId:user[0]._id},"faisal")
            })
        }else{
            return  res.status(404).send("Incorrect Password")
        }

        
    })
 
})


module.exports={
    userRoute
}