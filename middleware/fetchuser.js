var jwt = require('jsonwebtoken');
require('dotenv').config();
// const JWT_SECRET = 'BATTLEGROUNDMOBILEOFINDIA'
const secret=process.env.JWT_SECRET
fetchuser = (req, res, next) => {
    //Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: 'Please authenticate using valid token' })
    }

    try {
        const data = jwt.verify(token, secret)
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate using valid token' });
    }
}
module.exports = fetchuser;