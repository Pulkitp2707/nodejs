const express = require('express')
const router = new express.Router()
const User = require('../model/user.js')
// const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const multer = require('multer')

//Users
//creating user or signup
router.post('/users' , async (req,res) => {             
    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
    

    // user.save().then(() => {
    //     res.send(user)
    // }).catch((e) => {
    //     res.status(400)
    //     res.send(e)
    // })
})


//logging user
router.post('/users/login' , async (req,res) => {             
    try{
        const user = await User.findByCredentials(req.body.email , req.body.password)          //a function defined in user model
        const token = await user.generateAuthToken()                //a function defined in user model
        res.send({user,token})
    }catch(e){
        res.status(400).send()
    }
})

//logging out a particular user
router.post('/users/logout', auth , async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token   
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()

    }
})


//logging out all users
router.post('/users/logoutAll', auth , async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send({user})
    }catch{
        res.status(500).send()
    }
})



//uploading image
const upload = multer({
    // dest : 'avatar',             //if we dont provide this the image does not get saved in a folder, but the image is converted into buffer and send as 'req' to the next function
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb) {
        if(!file.originalname.match(/.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload .jpg or .jpeg or .png files'))
        }

        cb(undefined , true)
    }
}) 
router.post('/users/me/avatar' , auth ,upload.single('avatar') , async (req,res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
},(error,req,res,next) => {                                 //this function has four parameters which let express know that it can handle errors(see notes copy and L.126)
    res.status(400).send({ error: error.message })
})



//deleting uploaded image
router.delete('/users/me/avatar' , auth , async (req,res) => {
    req.user.avatar = undefined 
    await req.user.save()
    res.send()
})




router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})






//reading particular user and authenticating
router.get('/users/me' , auth ,async (req,res) => {                     //auth is middleware       
    res.send(req.user)
})


//update a user
router.delete('/users/me', auth ,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Update'})
    }


    try{
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        

        // const user = await User.findByIdAndUpdate(req.params.id , req.body , { new:true , runValidators:true })    //new is for sending the updated user  //we r not using this so that we can use the middleware .pre('save')

        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})




//delete a user
router.delete('/users/me' , auth, async (req,res) => {
    // const user = await User.findByIdAndDelete(req.user._id)
    await req.user.remove()             //mongoose function
    res.send(req.user)
})





module.exports = router