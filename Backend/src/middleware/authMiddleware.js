const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({msg: 'No token, authorization denied'});
    }
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7, authHeader.length).trim()
        : null;
    if (!token) {
        return res.status(401).json({msg: 'No token, authorization denied'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.user.id;
        next();
    } catch (err) {
        res.status(401).json({msg: 'Token is not valid'});
    }
}

module.exports = authMiddleware;
