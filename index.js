const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})
app.post('/contact', (req, res) => {
    const body = req.body
    const arr = JSON.parse(fs.readFileSync('./contact.json', 'utf8'));
    arr.push(body)
    fs.writeFileSync('./contact.json', JSON.stringify(arr), 'utf8')
    res.redirect('/')
})
app.listen(3000, () => {
    console.log("App is running at http://localhost:3000")
})
