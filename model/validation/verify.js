const jwt=require('jsonwebtoken');
function auth (req,res,next){
    // console.log(res.headers)
    const token = req.header('auth-token');
    if(!token) return res.status(401).json({
        status:"fail",
        message:"Access Denied"}) ;
    try {
        const verified=jwt.verify(token,process.env.TOKEN_SECRET);
        req.user=verified;
        next();
    } catch (e) {
        res.status(400).json({
            status:"fail",
            message:"Invalid token"}) 
    }
}

function decode_jwt(token){
    return jwt.decode(token)
}

module.exports={
    verify:auth,
    decode:decode_jwt
};