var express = require('express'),
    app = express(),
    fs = require('fs'),
    sinus = require('./sinus.js');

//app.configure(function() {
app.use(express.static(__dirname));
//});

app.get('/plan', function(req, res){
 // console.log(req.query);
 sinus.generate(req.query, res, function() {
  res.end();});});

app.get('/pics', function(req, res){
 fs.readdir(__dirname + '/img/', function(err, files) {
  res.send(files.filter(function (w) {return w.match(/^IMG.*/);}));});});

app.get('*', function(req, res){
 res.sendFile(__dirname + '/index.html');});

app.listen(process.env.PORT || '8080');
