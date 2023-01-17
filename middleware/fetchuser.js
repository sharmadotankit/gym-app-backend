const jwt = require('jsonwebtoken');
const JET = process.env.JWT_SECRET;

const fetchuser=(req,res,next)=>{
    const token = require.header('auth-token');
    if(!token){
        res.status(501).send({error:"Please authenticate with a valid token"})
    }
    const data = jwt.verify(token,JET);
    req.user = data.user
    next();
}

module.exports = fetchuser;