const mqtt = require('mqtt');
const express = require('express'); 
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const Device = require('./models/device');
const randomCoordinates = require('random-coordinates');
const rand = require('random-int');
const app = express();

//const { URL, USERNAME, PASSWORD } = process.env;
const port = process.env.PORT || 5001;

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({   
    extended: true 
}));

const client = mqtt.connect('mqtt://soldier.cloudmqtt.com:17092', {
 username: 'gjbkmrkg',
 password: '9VzT8n4453xg'
});

client.on('connect', () => {   
    console.log('mqtt connected'); 
    client.subscribe('/sensorData');
}); 

client.on('message', (topic, message) => {
    if (topic == '/sensorData') {
    const data = JSON.parse(message);
   
    Device.findOne({"name": data.deviceId }, (err, device) => {
    if (err) {
    console.log(err)
    }
   
    const { sensorData } = device;
    const { ts, loc, temp } = data;
    sensorData.push({ ts, loc, temp });
    device.sensorData = sensorData;
    device.save(err => {
    if (err) {
    console.log(err)
    }
    });
    });
    }
});

app.post('/send-command', (req, res) => {   
    const { deviceId, command }  = req.body;   
    const topic = `/command/${deviceId}`;   
    client.publish(topic, command, () => {     
        res.send('published new message');   
    }); 
});

app.put('/sensor-data', (req, res) => {
    const { deviceId } = req.body;
    const [lat, lon] = randomCoordinates().split(", ");
    const ts = new Date().getTime();
    const loc = { lat, lon };
    const temp = rand(20, 50);
    const topic = `/sensorData`;
    const message = JSON.stringify({ deviceId, ts, loc, temp });
    
    client.publish(topic, message, () => {
    res.send('published new message');
    });
        /**
* @api {get} /mqtt/devices AllDevices An array of all devices
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
 
app.listen(port, () => {   
    console.log(`listening on port ${port}`); 
})

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });