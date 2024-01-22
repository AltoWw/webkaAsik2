const express = require("express");
const https = require("https");
const axios = require("axios");
const geolib = require("geolib");

const app = express();
const port = 3000;
const additionalApiKey1 = '28sNWPHuFL8zTXysMbFACrcJ9MelAkAL0iMx7GMV'; 
const additionalApiKey2 = 'b16c7e5960msh46db22ac2cd7ea3p144a7bjsnf7141b265e74'; 

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/weather", function (req, res) {
    const city = req.query.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=315ca2c3d000650c533c858e43fc4781&units=metric`;

    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const weatherdata = JSON.parse(data);
            const temp = weatherdata.main.temp;
            const description = weatherdata.weather[0].description;
            const icon = weatherdata.weather[0].icon;
            const imgURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            res.write(`<h1>Temperature is ${temp} Celsius in ${city}</h1>`);
            res.write(`<h2>The weather currently is ${description}</h2>`);
            res.write(`<img src=${imgURL}>`);
            res.send();
        });
    });
});

app.get("/nasa", function (req, res) {
    const city = req.query.city;

    if (!city) {
        res.status(400).send("Bad Request: City parameter is missing");
        return;
    }

 
});

app.get("/covid19", function (req, res) {
    const city = req.query.city;

    if (!city) {
        res.status(400).send("Bad Request: City parameter is missing");
        return;
    }

});


function getNASAData(city) {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${additionalApiKey1}&date=2024-01-24`;
    return axios.get(url)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching NASA data:", error);
            throw error;  
        });
}

function getCOVID19Data(city) {
    const url = `https://api.covid19api.com/total/country/${city}`;
    return axios.get(url)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching COVID-19 data:", error);
            throw error;  
        });
}


app.listen(port, function(){
    console.log(`Server is running on port ${port}`);
});
