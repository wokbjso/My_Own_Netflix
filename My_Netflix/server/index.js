const express = require('express');
const path = require('path');
const app = express();
const port=5000;
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const {auth}=require('./middleware/auth');
const {User} =require('./User');
const config=require('./config/key');
const cors = require("cors");
let cors_origin = [`http://localhost:3000`];

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(
  cors({
    origin: cors_origin, // 허락하고자 하는 요청 주소
    credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
  })
);

mongoose.connect(config.mongoURI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

app.post('/api/users/register',async (req,res)=>{
  const checkUser=await User.findOne({
    email:req.body.email
  });
  if(checkUser){
    return res.send({
      success:false,
      message:"이미 회원가입된 이메일입니다."
    })
  }
  const user=new User(req.body);
  user.save().then(()=>{
    res.status(200).json({
      success:true
    })
  })
})

app.post('/api/users/login',async (req,res)=>{

  const checkUser=await User.findOne({
    email:req.body.email
  })

  if(!checkUser){
    return res.json({
      hasUser:false,
      loginSuccess:false,
      message:"해당 이메일은 가입되지 않았습니다."
    })
  }

  checkUser.comparePassword(req.body.password,(err,isMatch)=>{
      if(!isMatch) 
        return res.json({
          hasUser:true,
          loginSuccess:false,
          message:"비밀번호가 틀렸습니다."
        })
      
        checkUser.generateToken((err,user)=>{
          if(err) return res.status(400).send(err);
          
          res
          .status(200)
          .json({
            hasUser:true,
            loginSuccess:true,
            userName:user.name,
            token:user.token
          })
        })
    })
})

app.get('/api/users/auth',auth,(req,res)=>{
  res.status(200).json({
    _id:req.user._id,
    isAuth:true,
    email:req.user.email,
    name:req.user.name
  })
})

app.get('/api/users/getmovie',auth,(req,res)=>{
  res.status(200).json({
    movies:req.user.movieList
  })
})

app.post('/api/users/addmovie',auth,async (req,res)=>{
  const user=await User.findOneAndUpdate({
    _id:req.user._id
  },{movieList:req.body},{new:true})
  console.log(user.movieList)
  if(req.body.length===0 && user.movieList.length===0){
    return res.json({
      updateMovieList:true
    })
  }
  if(req.body.length!==0 && req.body[req.body.length-1].movieId===user.movieList[user.movieList.length-1].movieId){
    return res.json({
      updateMovieList:true
    })
  }
  return res.json({
      updateMovieList:false,
    })
})

app.get('/api/users/logout',auth,async (req,res)=>{
  const user=await User.findOneAndUpdate({
    _id:req.user._id,
  },{token:""},{new:true});
  if(user.token==="")
    return res.json({
      logoutSuccess:true
    })
    return res.json({
        logoutSuccess:false
      })
}
);

app.listen(port, function () {
  console.log(`listening on port ${port}`);
}); 

