const express = require("express");
const fs = require("fs");
const PORT = 3001;
const { v4: uuidv4 } = require('uuid');


const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).json(err);
      return;

    } else {
      let notes = JSON.parse(data);
      res.status(200).json(notes);
    }

  }
  
  )
});

app.use(express.static(path.join(__dirname, "./public")));

const ROOT = { root: path.join(__dirname, "./public") };

app.get("/", (req, res) => {
  res.sendFile("./index.html", ROOT);
});
app.get("/notes", (req, res) => {
  res.sendFile("./notes.html", ROOT);
});

app.post("/api/notes", (req, res) => {
  
  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4()
  };

  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      res.status(500).json(err);
      return;

    } else {
      let notes = JSON.parse(data);
      notes.push(newNote);
      const changedIntoString = JSON.stringify(notes);
      fs.writeFileSync("./db/db.json", changedIntoString, () => {});

      if (req.body) {
        // response = {
        //   status: 'success',
        //   data: newNote,
        // };
        res.status(201).json(newNote);
      } else {
        res.status(400).json("Request body wrong");
      }
    }

  });



});

app.delete("/api/notes/:id", (req,res) => {
  console.log(req.params.id);
  fs.readFile('db/db.json', (err, data) => {
    if (err) throw err;
    let noteString = JSON.parse(data);
    const filtered = noteString.filter(note => note.id !== req.params.id);
    fs.writeFile('db/db.json', JSON.stringify(filtered), err => err ? console.log(err) : res.redirect('/notes'));
  });
});

app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
