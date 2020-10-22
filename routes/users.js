
const fs = require("fs");
const path = require("path");
const crypto = require('crypto');
const express = require("express");
const multer = require("multer");
const nodemailer = require('nodemailer');
const router = express.Router();
const User = require("../models/user");

//allowed image extensions
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
};

//image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, path.join(__dirname, "../images"));
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, req.body.email.split('@')[0] + "." + ext);
    }
});

//nodemailer transport for mails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nsimranjain@gmail.com',
        pass: 'abcd'
    }
});

// route handler to store users
router.post("", multer({ storage: storage }).single("profilePic"), (req, res, next) => {
    let user = new User({
        ...req.body,
        profilePic: fs.readFileSync(path.join(__dirname + '../images/' + req.file.filename))
    });

    user.save()
        .then(_resp => {
            const userId = req.body.email.split('@')[0];
            const password = crypto.randomBytes(9).toString('utf8');
            const mailOptions = {
                from: 'nsimranjain@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: 'Login- Provab Technosoft', // Subject line
                html: '<p><b>Welcome to Provab Technosoft,</b><br><br>Greetings of the day!<br><br>Your Login Credentials are as below: <br> User Id: ' + userId + ' <br> Password: ' + password + '<br>Assuring you of our best services,always.<br>Team Provab Technosoft.<br><br><br>This E-Notification was automatically generated.Please do not reply to this mail.<br>For further information visit our site <a href="https://www.provab.com/">www.provab.com</a></p>'// plain text body
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    res.status(431).json('Mail could not be sent :(');
                }
                else
                    res.status(200).json("User Created and Mail Sent.");
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json('User not created :(');
        });
});

// route handler for getting users
router.get('', (req, res, next) => {
    User.find()
        .then(users => {
            let userList = users.map(user => {
                let [...userInfo, profilePic] = user;
                return userInfo;
            })
            res.status(200).json(userList);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json('User not retrieved :(');
        });
});

module.exports = router;
