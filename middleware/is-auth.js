module.exports = (req,res,next)=>{
    console.log("req.session ",req.session.isLoggedIn)
    if(!req.session.isLoggedIn){
        return res.send({message : "Not logged In"})
    };
    next();
}