const express = require('express')
const router = express.Router();
require('dotenv').config();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
// const JWT_SECRET = 'BATTLEGROUNDMOBILEOFINDIA' 
const secret=process.env.JWT_SECRET
// router.get('/',(req,res)=>{
//     console.log(req.body)
//     res.send('Hello')
// })




//ROUTE-1 create user using: POST "/api/auth/createuser" Doesn't require Auth //no login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('username', 'Enter a valid email').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Passwords must not be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    

    //If there are errors,return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    //check weather the user with same email  exists already
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success, error: 'Sorry a user with this email already exists' })
        }

        const salt = await bcrypt.genSalt(10);  //it is use for hasing password and add salt which improve password security
        const secPass = await bcrypt.hash(req.body.password, salt);
        //create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            // password: req.body.password,
            password: secPass,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, secret);

        // res.json(user)
        success = true;
        res.json({ success, authToken })
    }
    //catch the errors
    catch (error) {
        console.error(error.message);
        res.status(500).send('Iternal server error')
    }
})


//ROUTE-2 authenticate a user using: POST "/api/auth/login" Doesn't require Auth //no login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Passwords cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    //If there are errors,return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;        //destructuring  (exract value from body or anything)
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
        }

        const passwordcompare = await bcrypt.compare(password, user.password)
        if (!passwordcompare) {
            success = false;
            return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, secret);
        success = true;
        res.json({ success, authToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Iternal server error')
    }


})

//ROUTE-3 get logged in user detail  using: POST "/api/auth/getuser" // Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");     //you get all data except password
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Iternal server error')
    }
})


// const express=require('express')
// const router=express.Router();
// const User = require('../models/User');

// router.get('/',(req,res)=>{
//     console.log(req.body);
//     const user=User(req.body);
//     user.save()
//     res.send('Hello')
// })

module.exports = router