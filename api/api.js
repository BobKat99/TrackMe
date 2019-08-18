const express = require('express');
const Device = require('./models/device');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
   });  

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json()) 
   
app.use(express.static(`${__dirname}/public`));

app.get('/api/test', (req, res) => {
 res.send('The API is working!');
    res.send('The API is working!'); 
 res.send('The API is working!');
});
app.listen(port, () => {
 console.log(`listening on port ${port}`);
    console.log(`listening on port ${port}`); 
 console.log(`listening on port ${port}`);
});

app.get('/api/devices', (req, res) => {   
    Device.find({}, (err, devices) => {     
        return err       
        ? res.send(err)       
        : res.send(devices);   
    }); 
    /**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
* [
* {
* "_id": "dsohsdohsdofhsofhosfhsofh",
* "name": "Mary's iPhone",
* "user": "mary",
* "sensorData": [
* {
* "ts": "1529542230",
* "temp": 12,
* "loc": {
* "lat": -37.84674,
* "lon": 145.115113
* }
* },
* {
* "ts": "1529572230",
* "temp": 17,
* "loc": {
* "lat": -37.850026,
* "lon": 145.117683
* }
* }
* ]
* }
* ]
* @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/
}); 

app.post('/api/devices', (req, res) => {   
    const { name, user, sensorData } = req.body;   
    const newDevice = new Device({     
        name,     
        user,     
        sensorData   
    });
    newDevice.save(err => {   
        return err       
        ? res.send(err)       
        : res.send('successfully added device and data'); 
    });
});

app.post('/api/devices', (req, res) => {  
    console.log(req.body);
});  

app.get('/docs', (req, res) => {
 res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });