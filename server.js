const express = require('express');
const path = require('path');

const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Import uuidv4

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const dbFilePath = path.join(__dirname, 'db/db.json');

//HTML ROUTES
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });

  //NOT WORKING??
app.get('/notes', function(req, res) {
  const notesFilePath = path.join(__dirname, 'public', 'notes.html');
  res.sendFile(notesFilePath);
});

//GET ALL NOTES API
app.get('/api/notes', function(req, res) {

  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    try {
      const notes = JSON.parse(data);
      res.json(notes);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

});

//POST NEW NOTES API
app.post('/api/notes', function(req, res) {
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    try {
      const notes = JSON.parse(data);
      const newNote = {
        id: uuidv4(), // Generate a unique ID for the new note
        title: req.body.title,
        content: req.body.content,
      };

      notes.push(newNote);

      fs.writeFile(dbFilePath, JSON.stringify(notes, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error writing to db.json:', writeErr);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        res.status(201).json(newNote); // Return the new note with a 201 status (Created)
      });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// DELETE NOTE API
app.delete('/api/notes/:id', function(req, res) {
  const noteId = req.params.id;

  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    try {
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter(note => note.id !== noteId);

      fs.writeFile(dbFilePath, JSON.stringify(updatedNotes, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error writing to db.json:', writeErr);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        res.json({ message: 'Note deleted successfully' });
      });
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

app.listen(port);
console.log('Server started at http://localhost:' + port);