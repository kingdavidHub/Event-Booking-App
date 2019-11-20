const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // * Look into the incoming request if there is a header of authorization
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    // * Extract the token if it is valid
    // ! split the bearer and the token so we get the token alone
    const token = authHeader.split(' ')[1]; 
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }
    // * decoded token
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesupersecretkey');   
    } catch (error) {
        req.isAuth = false;
        next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next(); 
};