const {User}=require('../User');

const auth=(req,res,next)=>{

    const authHeader = req.headers.authorization;
    const token = authHeader&&authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401).json();
    }

    User.findByToken(token,(err,user)=>{
        if(err) throw err;
        if(!user) return res.json({
            isAuth:false,
            error:true
        });

        req.user=user;
        next();
    })
}

module.exports={auth};