import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const port=3000;
const app=express();
const API="e2d2712c5e552740dd2230ac66165b22";
var country="";
var city="";
var limit="";
var lon="";
var lat="";
const weather=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("index.ejs");
});
app.get("/form",(req,res)=>{
    res.render("form.ejs");
});
app.get("/weather",async(req,res)=>{
    res.render("weather.ejs");
    try {
        // const response=await axios.get("http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=e2d2712c5e552740dd2230ac66165b22");
        // console.log(response);
    } catch (error) {
        console.log(error);
    }
});
app.post("/submit",async(req,res)=>{
    console.log(req.body);
    res.render("weather.ejs");
    try {
        city=req.body.city;
        limit=req.body.limit;
        country=req.body.country;
        console.log(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${API}`);
        const response=await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${API}`);
        for (let index = 0; index < limit; index++) {
            if (response.data[index].country==country) {
             lat=response.data[index].lat;
             lon=response.data[index].lon;  
            }   
        }
        const result=await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`)
        console.log(result);
    } catch (error) {
        console.log(error);
    }
});
app.listen(port,()=>{
    console.log(`Connected successfully to port ${port}`);
});