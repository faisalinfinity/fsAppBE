const express=require("express")
const cors=require("cors")
const { postRoute } = require("./routes/postRoute")
const { userRoute } = require("./routes/userRoute")
const { connection } = require("./connection/connection")
require("dotenv").config()

const app=express()

app.use(cors())
app.use(express.json())

app.use("/users",userRoute)
app.use("/posts",postRoute)


    
    app.listen(process.env.PORT,async ()=>{
        await connection
        console.log(`Connected to MongoDB on PORT ${process.env.PORT}`)
    })
