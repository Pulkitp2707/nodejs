const notes = require('./notes.js')
const yargs = require('yargs')

// console.log(process.argv)

//customize yargs version
yargs.version('0.0.7')
// console.log(yargs.argv)


//Create add command
yargs.command({
    command: 'add',
    description: 'Add a note',
    builder:{
        title:{
            describe:'Note title',
            demandOption:true,
            type:'string'
        },
        body:{
            describe:'Note body',
            demandOption:true,
            type:'string'
        }
    },
    handler: function(argv){
        notes.addNote(argv.title, argv.body)
    }
})

//Create remove command
yargs.command({
    command:'remove',
    description: 'Add the title to remove',
    builder:{
        title:{
            describe:'Note title to be removed',
            demandOption:true,
            type:'string'
        }
    },
    handler: function(argv){
        notes.removeNote(argv.title)
    }
})

//Create list command
yargs.command({
    command: 'list',
    description: 'Listing the notes',
    handler: function(){
        notes.list()
    }
})

//Create read command
yargs.command({
    command: 'read',
    description: 'Read a note',
    builder:{
        title:{
            description:'Title of the note to be read',
            demandOption: true,
            type:'string'
        }
    },
    handler: function(argv){
        notes.read(argv.title)
    }
})


yargs.parse()