const request = require('request')
const chalk= require('chalk')

const forecast = (latitude, longitude, location) =>{
    const url = 'https://api.darksky.net/forecast/3b161d2e09b01e27005716666cda0b8e/'+latitude+','+longitude+'?units=si'
        request({url : url , json:true} , (error,response)=>{
            if(error){
                console.log('Unable to connect to weather services')
            }
            else if(response.body.error){
                console.log('Invalid location')
            }
            else{
                const rain =  response.body.currently.precipIntensity
                const temp = response.body.currently.temperature 
                console.log("The temperature in "+location+" is "+ chalk.inverse(temp) + " degrees.There is "+ chalk.inverse(rain + "%") +" chance of rain")
            }
})
}

module.exports = forecast