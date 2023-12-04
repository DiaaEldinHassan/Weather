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
const ss='https://sunrise-sunset-times.p.rapidapi.com/getSunriseAndSunset';
var hourper="";
var hourper1st="";
var hourper2nd="";


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

    try {
        city=req.body.city;
        limit=req.body.limit;
        country=req.body.country;
        const response=await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${API}`);
        for (let index = 0; index < limit; index++) {
            if (response.data[index].country==country) {
             lat=response.data[index].lat;
             lon=response.data[index].lon;
            }   
        }
        const result=await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`);
        hourper=dayNight();
        hourper1st=hourper.slice(0,1);
        hourper2nd=hourper.slice(1,3);
        celsius=temp(result.data.main.temp);
        atmo=result.data.weather[0].main;
        res.render("weather.ejs",{weather:celsius,atmo:atmo,city:city,country:country,hour:hourper1st,period:hourper2nd});
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
function dayNight()
{
    var date = new Date();
    var day=date.getDay();
    // Get current hour
    var hour = date.getHours();
    // Get current minute
    var minute = date.getMinutes();
    // Get current second
    var second = date.getSeconds();
   
    // Variable to store AM / PM
    var period = "";
   
    // Assigning AM / PM according to the current hour
    if (hour >= 12) {
    period = "PM";
    } else {
    period = "AM";
    }
   
    // Converting the hour in 12-hour format
    if (hour == 0) {
    hour = 12;
    } else {
    if (hour > 12) {
    hour = hour - 12;
    }
    }
    return(hour+period);
}
app.listen(port,()=>{
    console.log(`Connected successfully to port ${port}`);
});