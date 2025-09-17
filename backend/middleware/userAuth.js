const jwt = require('jsonwebtoken')



const userAuth = async (req, res, next) => {
    try {
        //Get the token from cookies
        const {token} = req.cookies;
        
        //Check the login or not
        if(!token) {
            return req.status(400).send({success: false, message: "Not Authorized. Login Again!"})
        }

        //Get token decode
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        //Check the token is valid or  not
        if(tokenDecode?.id) {
            
            req.body = { userId: tokenDecode.id}
            next();
        }else {
            return req.status(400).send({success: false, message: "Not Authorized. Login Again!"})
        }

    } catch (error) {
        //Send error message when it is cause error
        return res.status(400).send({success: false, message: error})
    }
}

module.exports = userAuth;