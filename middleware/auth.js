const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'THE TRUTH IS OUT THERE');
        const userId = decodedToken.userId;
        req.auth = {
            user: userId
        };
        next();
    } catch(error) {
        res.status(400).json({ error }); 
    }
}