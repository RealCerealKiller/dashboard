var express = require('express')
var app = express()
var path = require("path");

app.use(express.static('public'))

app.get('/sf_dashboard', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
})

app.listen(3003, function () {

})
