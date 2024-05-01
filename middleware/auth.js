const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const token = req.header("X-Register-Token");
    if (!token) return res.status(401).send("Access denied. Not token provided");

    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = decoded;
        next();
    }
    catch (ex) {
        res.status(400).send("Invalid token");
    }
}   

module.exports = auth;