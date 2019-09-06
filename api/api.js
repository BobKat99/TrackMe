const express = require('express');
const Device = require('./models/device');
const User = require('./models/user');
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

app.post('/api/authenticate', (req, res) => {   
    const { name, password } = req.body;

    User.findOne({name, password}, (err, users) => {     
        if (err == true) return res.send(err);
        else if (users == undefined) return res.send('user does not exist');
        else return res.json({
            success: true,
            message: 'authenicated successfully',
            isAdmin: users.isAdmin
        });
    }); 
});

app.post('/api/registration', (req, res) => {  
    const { name, password, isAdmin } = req.body;
    User.findOne({name, password, isAdmin}, (err, users) => {
        if (err == true) return res.send(err);
        else if (users == undefined) 
        {
        const newUser = new User({
            name,
            password,
            isAdmin
           });
    
        newUser.save(err => {
            return err
                ? res.send(err)
                : res.json({
                success: true,
                message: 'Created new user'
                });
        });  
    }
        else return res.send('User exist')
    }); 
    
      
});

app.get('/api/devices/:deviceId/device-history', (req, res) => {
    const { deviceId } = req.params;
    Device.findOne({"_id": deviceId }, (err, devices) => {
    const { sensorData } = devices;
    return err
        ? res.send(err)
        : res.send(sensorData);
        });
});

app.get('/api/users/:user/devices', (req, res) => {
    const { user } = req.params;
    Device.find({ "user": user }, (err, devices) => {
        return err
        ? res.send(err)
        : res.send(devices);
    });
});
app.get('/docs', (req, res) => {
 res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });