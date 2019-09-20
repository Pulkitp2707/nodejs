const geocode = (name) =>{
    setTimeout( ()=>{
        const data={
            latitude:0,
            longitude:0
        }
        call(data)
    },2000)
}

geocode('Pulkit')
//     console.log(data)

// })

const call = (data) =>{
    console.log(data)
}