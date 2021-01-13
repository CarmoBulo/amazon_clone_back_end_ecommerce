//include library
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const { check, validationResult, body } = require('express-validator');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const User = require('../models/User');
const token_key = process.env.TOKEN_KEY;

// middleware setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// default route
// Access: public
// url: http://localhost:500/api/users/
// method: GET
router.get(
    '/', 
    (req, res) => {
        return res.status(200).json(
            {
                "status": true,
                "message": "User default route."
            }

        );
    }
);

// user register route
// Access: public
// url: http://localhost:500/api/users/
// method: POST
 
router.post(
    '/register',
    [
    //check empty fields
       check('username').not().isEmpty().trim().escape(),
       check('password').not().isEmpty().trim().escape(),

    //check email
    check('email').isEmail().normalizeEmail()
    ],
    (req, res) => {  
        const errors = validationResult(req);

        // check errors is not empty
        if(!errors.isEmpty()) {
            return res.status(400).json({
                "status": false,
                "errors": errors.array()
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        //console.log(hashedPassword);

        return res.status(200).json({ 
            "status" : true,
            "data" : req.body,
            "hashedPassword" : hashedPassword
        });
      }
);


module.exports = router;


