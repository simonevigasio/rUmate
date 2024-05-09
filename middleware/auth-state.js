function authState(req, res, next) {
    if (req.user) return res.status(400).send("User already registered with Google");
    next();
}

module.exports = authState;