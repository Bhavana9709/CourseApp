
// This funtion is middleware. 
function verifyToken(req, res, next) {
    try {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearerToken = bearerHeader.split(' ')[1];
            req.token = bearerToken;
            next();
        }
        else {
            res.send("Not logged-in")
        }
    }
    catch {
        res.send("something went wrong")
    }
}