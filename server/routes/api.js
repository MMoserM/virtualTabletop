const express = require('express'),
    jwt = require('jsonwebtoken'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Message = require('../modules/message'),
    User = require('../modules/user');
    //db = 'mongodb://user:psw@host:port/database'; 

mongoose.Promise = global.Promise;
mongoose.connect(db, (err) => {
    if(err){
        console.error('Error! ' + err);
    } else {
        console.log('Connected with no errors...');
    }
});

function verifyToken(req, res, next){
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    }

    const token = req.headers.authorization.split(' ')[1];
    if(token === null) {
        return res.status(401).send('Unauthorized request');
    }

    const payload = jwt.verify(token, 'secretKey');
    if(!payload) {
        return res.status(401).send('Unauthorized request');
    }

    req.userId = payload.subject;
    next();
}

router.post('/register', (req, res) => {
    let userData = req.body;
    let user = new User(userData);
    user.save((error, registeredUser) => {
        if(error) {
            console.log(error);
        } else {
            let payload = { subject: registeredUser._id };
            let token = jwt.sign(payload, 'secretKey');            
            res.status(200).send({token});
        }
    });
});

router.post('/login', (req, res) => {
    let userData = req.body;
    User.findOne({email: userData.email}, (error, user) => {
        if(error) {
            console.log(error);
        } else {
            if (!user) {
                res.status(401).send('Invalid email');
            } else if (user.password !== userData.password) {
                res.status(401).send('Invalid password');
            } else {
                let payload = { subject: user._id };
                let token = jwt.sign(payload, 'secretKey');
                res.status(200).send({token});
            }
        }
    });
});

router.get('/events', (req, res) => {
    let events = [
        {
            "_id": "1",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
          },
          {
            "_id": "2",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
          },
          {
            "_id": "3",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
          },
          {
            "_id": "4",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
          },
          {
            "_id": "5",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
          },
          {
            "_id": "6",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
      }
    ];

    res.json(events);
});

router.get('/special', verifyToken, (req, res) => {
    let events = [
        {
            "_id": "1",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
          },
          {
            "_id": "2",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
          },
          {
            "_id": "3",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
          },
          {
            "_id": "4",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
          },
          {
            "_id": "5",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
          },
          {
            "_id": "6",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
      }
    ];

    res.json(events);
});

router.get('/messages', (req, res) => {
    console.log('Get request for chat history');
    Message.find({}).exec((err, messages) => {
        if(err){
            console.log('Error retrieving messages');
        } else {
            res.json(messages);
        }
    });
});

router.post('/message', (req, res) => {
    console.log('Post a message');
    let newMessage = new Message();
    newMessage.name = req.body.name;
    newMessage.message = req.body.message;
    if(newMessage.name !== '' && newMessage.message !== ''){
        newMessage.save((err, insertedMessage) => {
            if(err){
                console.log('Error saving message');
            } else {
                res.json(insertedMessage);
            }
        });
    }
});

module.exports = router;