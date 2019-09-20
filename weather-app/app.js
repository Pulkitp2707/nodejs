const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')


geocode(process.argv[2] , (error ,data)=>{
    if(error){
        console.log(error)
    }
    else{
        forecast(data.latitude,data.longitude,data.location)
    }
})
