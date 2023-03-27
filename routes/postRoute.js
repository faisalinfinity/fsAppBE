const express=require("express")
const { AuthorizationMiddleware } = require("../middlewares/authorization.middleware")
const { postModel } = require("../models/postModel")

const postRoute=express.Router()

postRoute.use(AuthorizationMiddleware)


postRoute.get("/",async(req,res)=>{
    const mincomment=+req?.query?.mincomment
    const maxcomment=+req?.query?.maxcomment
    const device1=req?.query?.device1
    const device2=req?.query?.device2
    const page=+req.query.page || 1
    const limit=+req.query.limit || 3
     const device=req?.query.device
    const skip=(page-1)*limit


    try {
       let data= postModel.find({userId:req.body.userId})
       
       if(maxcomment && mincomment){
        data.find({
            $and:[
                {no_of_comments:{$gte:mincomment}},
                {no_of_comments:{$lte:maxcomment}}
            ]
        })
       }
       if(device){
        data.find({device:device})
       }   

       if(device1 && device2){
        data.find({
            $or:[
                {device:device1},
                {device:device2}
            ]
        })
       }
  
         const total=await postModel.countDocuments(data)

         const postData=await data.skip(skip).limit(limit).exec()

         res.json(postData)
 
    } catch (error) {
        res.status(400).send(error.message)
    }

})


postRoute.post("/add",async(req,res)=>{
    try {
        const newPost=new postModel(req.body)
       await newPost.save()

    res.send("You post has been added")
    } catch (error) {
        res.status(400).send(error.message)
    }

})

postRoute.get("/top",async(req,res)=>{

   
    const page=+req.query.page || 1
    const limit=+req.query.limit || 3
    const skip=(page-1)*limit


    try {
       let data= postModel.find({userId:req.body.userId}).sort({no_of_comments:-1})
        

  
         const total=await postModel.countDocuments(data)

         const postData=await data.skip(skip).limit(limit).exec()

         res.json(postData)
 
    } catch (error) {
        res.status(400).send(error.message)
    }

})

postRoute.patch("/update/:id",async(req,res)=>{
  const {id} =req.params

  try {
      
    await postModel.findByIdAndUpdate({_id:id},req.body)
    res.json( await postModel.find({userId:req.body.userId}))
  } catch (error) {
    res.send(err.message)
  }
})

postRoute.delete("/delete/:id",async(req,res)=>{
    const {id} =req.params

    try {
        
      await postModel.findByIdAndDelete({_id:id})
      res.json( await postModel.find({userId:req.body.userId}))
    } catch (error) {
      res.send(err.message)
    }
})

module.exports={
    postRoute
}