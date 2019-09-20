const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task =require('./task')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique:true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        validate(value) {
            if(value.toLowerCase().includes("password")){
                throw new Error('password contains password')
            }
        }
        
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }],
    avatar: {
        type: Buffer
    }
},{                                       
    timestamps:true
})


userSchema.virtual('tasks', {               //creating a virtual field with name 'tasks' (Lecture-114)
    ref: 'Task',
    localField: '_id',                      //creating a relationship between '_id' of User model and 'owner' field of Task model
    foreignField: 'owner'
})


userSchema.methods.toJSON = function(){               //toJSON is like a middleware.It runs before res.send()
    const userObject = this.toObject()

    delete userObject.password
    delete userObject.tokens
    
    return userObject
}

userSchema.methods.generateAuthToken = async function(){                           //methods functions are available on instances
    const token = jwt.sign({ _id : this._id.toString() }, 'thisisme')              //create a web token
    this.tokens = this.tokens.concat({token:token})
    await this.save()
    return token
}               






userSchema.statics.findByCredentials = async (email,password) => {                 //static functions are available on models(like User model,Task model)
    const user = await User.findOne({email})


    if(!user){
        throw new Error('Invalid login!')
    }
    const isMatch = await bcrypt.compare(password , user.password)

    if(!isMatch){
        throw new Error('Invalid login!')
    }

    return user
}


userSchema.pre('save', async function (next) { 
    
    if(this.isModified('password')){                             //function to check if the password is hashed or not
        this.password = await bcrypt.hash(this.password ,8)
    }
    next()
})

//remove tasks of the user being is deleted
userSchema.pre('remove' , async function(next) {
    await Task.deleteMany({ owner:this._id })
    next()
})


const User = mongoose.model('User', userSchema)
module.exports = User 