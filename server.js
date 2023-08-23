const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//HTML ROUTES
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });

app.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname, '/notes.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);