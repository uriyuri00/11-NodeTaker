const express = require('express');
const fs = require('fs')
const PORT = 3001;
let notes = require('./db/db.json');

const app = express();
const path = require("path");


app.use(express.json());
// TODO: Implement middleware for parsing of URL encoded data
app.use(express.urlencoded({ extended: true }));

// GET request for ALL reviews
app.get('/api/notes', (req, res) => {
  
  return res.status(200).json(notes);
});
app.use(express.static(path.join(__dirname, "./public")));
const ROOT = { root: path.join(__dirname, './public') };

app.get("/", (req, res) => {
    res.sendFile("./index.html", ROOT);
})
app.get("/notes", (req, res) => {
    res.sendFile("./notes.html", ROOT);
})


app.post('/api/notes', (req, res) => {
   console.log( req.body)
   notes.push(req.body);
   const changedIntoString = JSON.stringify(notes)
   fs.writeFileSync("./db/db.json", changedIntoString, ()=>{})

  if (req.body && req.body.product) {
    response = {
      status: 'success',
      data: req.body,
    };
    res.status(201).json(response);
  } else {
    res.status(400).json('Request body wrong');
  }

  console.log(req.body);
});


app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
