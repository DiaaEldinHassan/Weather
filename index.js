import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const port=3000;
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.listen(port,()=>{
    console.log(`Connected successfully to port ${port}`);
});