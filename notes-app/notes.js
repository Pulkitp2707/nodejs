const fs = require('fs')
const chalk = require('chalk')

const addNote = (title,body) => {
    const notes = loadNotes()
    // console.log(notes)
    const duplicateNote = notes.find(note => {
         return note.title==title 
    })

    if(!duplicateNote){
        notes.push({
            title:title,
            body:body
        })
        savedNotes(notes)
        console.log('Note added')
    }
    else{
        console.log('Duplicate note encountered')
    }
}

const loadNotes = () => {
    try{
    const dataBuffer = fs.readFileSync('notes.json')
    const dataJSON = dataBuffer.toString()
    const data = JSON.parse(dataJSON)
    return data
    } catch(err){
        return []
    }    
}

debugger
const savedNotes = (notes) => {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json' , dataJSON)
}


const removeNote = (title) => {
    const notes = loadNotes()
    const updatedNotes = notes.filter(note => {
        return note.title != title
    })
    if(updatedNotes.length == notes.length)
    {
        console.log(chalk.black.bgRed("No note found"))
    }
    else
    {
        console.log(chalk.black.bgGreen("Note deleted"))
    }
        savedNotes(updatedNotes)

}

const list = () =>{
    const notes = loadNotes()
    console.log(chalk.inverse("Your notes:"))
    notes.map((note,index) => {
        console.log(index+1 +".")
        console.log("Title :"+ note.title)
        console.log("Body :"+ note.body)
    })
}

const read = (title) => {
    const notes = loadNotes()
        const note = notes.find(note => {
            return note.title == title
        })
        if(note){
            console.log("Title :"+ note.title)
            console.log("Body :"+ note.body)
        }
    else if(!note){
        console.log(chalk.red.inverse("Error"))
    }
}
module.exports = {
    addNote,removeNote,list,read
}