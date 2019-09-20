const request = require('request')

const geocode = (address , callback) =>{
    if(address)
    {
    const coord_url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+encodeURIComponent(address)+'.json?access_token=pk.eyJ1IjoicHVsa2l0cDI3MDciLCJhIjoiY2p3dzA5ejdqMDJidjQ1cG01bGl4YW5zdyJ9.I4UII0z_VZ29clrrL8o_Eg'
    request({ url:coord_url , json:true },(error,response)=>{
        if(error){
            callback('Unable to connect to location services', undefined)
        }
        else if(response.body.features.length == 0){
            callback('No such place exist', undefined)
        }
        else{
            const data = {
                latitude : response.body.features[0].center[1],
                longitude : response.body.features[0].center[0],
                location : response.body.features[0].place_name
            }
            callback(undefined, data)
        }
    })
    }
    else{
        console.log('Enter location')
    }
}

module.exports = geocode 