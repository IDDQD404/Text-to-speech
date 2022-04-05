const express = require('express')

const path = require('path');

const app = express()
app.use(express.json())

var cors = require('cors');
app.use(cors());

const fs = require('fs');

const {spawn} = require('child_process');

let savedirectory = path.join(__dirname , "save/") 

app.post('/message', async (req, res) => {

  const { text , language , savefilename } = req.body 

  let dataToVoice = '{ "text" : "' + text + '" , "language" : "' + language + '" , "savefilename" : "' + savefilename + '" , "savefiledirectory" : "' + savedirectory + '" }'

  console.log( dataToVoice )
  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn('python', ['PYscript.py']);
  // collect data from script
  python.stdout.on('data', function (data) {
   console.log('Pipe data from python script ...');
  });

  python.stdin.write( dataToVoice );

  python.stdin.end();


  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
   });

  // in close event we are sure that stream from child process is closed
  python.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
  // send data to browser
  res.sendStatus(200)
  });

})


app.get('/message/:filename', async (req, res) => {

  console.log("get")
  
  var directoryPath = path.join(__dirname , "save" );

  fs.readdir(directoryPath, function (err, files) {

  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  files.forEach(function (file) {

    if(file == req.params.filename + '.mp3')
    {
      res.sendFile( savedirectory + file )
    }

    });
  });

})


app.listen({ port: 3000 })
