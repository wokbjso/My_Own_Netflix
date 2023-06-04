const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const saltRounds=10;
const jwt=require('jsonwebtoken');
const TOKEN_KEY="secretToken"

const userSchema=mongoose.Schema({
    name:{
        type:String,
        maxlength:20
    },
    email:{
        type:String,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        minlength:8
    },
    token:{
        type:String
    }, 
    movieList:[
        {
            movieId:{
                type:Number,
                required:true
            },
            movieTitle:{
                type:String,
                required:true
            }
        }
    ]
});

userSchema.pre('save',function(next){
    let user=this;

    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds,function(err,salt){
            if(err) return next(err);
    
            bcrypt.hash(user.password,salt,function(err,hash){
                if(err) return next(err);
                user.password=hash;
                next();
            })
        })
    } else{
        next();
    }

});

userSchema.methods.comparePassword=function(plainPassword,cb){
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err) return cb(err);
        cb(null,isMatch);
    })
}

userSchema.methods.generateToken=function(cb){
    const user=this;
    const token=jwt.sign(user._id.toHexString(),TOKEN_KEY);
    user.token=token;
    user.save().then((res,err)=>{
        if(err) return cb(err);
        cb(null,res);
    });
}

userSchema.statics.findByToken=function(token,cb){
    jwt.verify(token,TOKEN_KEY,async function(err,decoded){
        try{
            const user=await User.findOne({
                token
            });
            return cb(null,user)
        } catch(err){
            return cb(err);
        }
    })
}

const User=mongoose.model('User',userSchema);

module.exports={User};