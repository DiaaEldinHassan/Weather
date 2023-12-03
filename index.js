import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import {api} from "./api.js";

const port=3000;
const app=express();
const API=api;
var country="";
var city="";
var limit="";
var lon="";
var lat="";
var celsius=0;
var atmo="";
const weather=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`;

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
});
app.post("/submit",async(req,res)=>{
    console.log(req.body);
    try {
        city=req.body.city;
        limit=req.body.limit;
        country=req.body.country;
        
        console.log(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${API}`);
        const response=await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${API}`);
        console.log(response.data[0].country);
        for (let index = 0; index < limit; index++) {
            if (response.data[index].country==country) {
             lat=response.data[index].lat;
             lon=response.data[index].lon;
            }   
        }
        const result=await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`);
        celsius=temp(result.data.main.temp);
        atmo=result.data.weather[0].main;
        res.render("weather.ejs",{weather:celsius,atmo:atmo});
    } catch (error) {

        res.render("weather.ejs",{weather:error.status});
    }
});
function temp(weather)
{
    var kelvin=-273.15;
    var cel=weather+kelvin;
    return Math.round(cel);
}
app.listen(port,()=>{
    console.log(`Connected successfully to port ${port}`);
});