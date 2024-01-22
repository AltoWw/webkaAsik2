const express = require("express");
const https = require("https");
const axios = require("axios"); 
const geolib = require("geolib"); 

const app = express();
const port = 3000;

app.use(express.static("public"));

const openWeatherApiKey = 'a61f6654cdbd955978cfe70ba1df96ac';

const additionalApiKey1 = "YOUR_ADDITIONAL_API_KEY_1";
const additionalApiKey2 = "YOUR_ADDITIONAL_API_KEY_2";

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/weather", function (req, res) {
    const city = req.query.city;

    getWeatherData(city)
        .then(weatherData => {
            const additionalData1Promise = getAdditionalData1(city);
            const additionalData2Promise = getAdditionalData2(city);

            Promise.all([additionalData1Promise, additionalData2Promise])
                .then(([additionalData1, additionalData2]) => {
                    res.json({
                        weather: weatherData,
                        additional1: additionalData1,
                        additional2: additionalData2
                    });
                })
                .catch(error => {
                    console.error("Error fetching additional data:", error);
                    res.status(500).send("Internal Server Error");
                });
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            res.status(500).send("Internal Server Error");
        });
});

app.get("/geolocation", function (req, res) {
    const city = req.query.city;

    getCoordinates(city)
        .then(coordinates => {
            res.json({ coordinates });
        })
        .catch(error => {
            console.error("Error fetching coordinates:", error);
            res.status(500).send("Internal Server Error");
        });
});

app.listen(port, function () {
    console.log(`Server is running on port ${port}`);
});

function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}&units=metric`;

    return new Promise((resolve, reject) => {
        https.get(url, function (response) {
            let data = "";
            response.on("data", chunk => {
                data += chunk;
            });

            response.on("end", () => {
                const weatherData = JSON.parse(data);
                resolve(weatherData);
            });

            response.on("error", error => {
                reject(error);
            });
        });
    });
}

function getAdditionalData1(city) {
    const url = `https://api.example.com/data1?city=${city}&apikey=${additionalApiKey1}`;

    return axios.get(url)
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}

function getAdditionalData2(city) {
    const url = `https://api.example.com/data2?city=${city}&apikey=${additionalApiKey2}`;

    return axios.get(url)
        .then(response => response.data)
        .catch(error => {
            throw error;
        });
}

function getCoordinates(city) {
    const url = `https://geocoding-api.com?city=${city}`;

    return axios.get(url)
        .then(response => response.data.coordinates)
        .catch(error => {
            throw error;
        });
}
