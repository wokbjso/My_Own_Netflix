import { motion } from "framer-motion";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import axiosPublic, { axiosPrivate } from "../axios";
import LoginHeader from "../components/LoginHeader";
import { accessToken, movieList} from "../recoil";
import { PRIVACY_URL, SERVICE_URL } from "../URL/url";
import { BackgroundWrapper } from "./About";
import { Error } from "./Register";

export const FormWrapper=styled.div`
    width:400px;
    height:600px;
    background-color: rgba(0,0,0,1);
`

export const FormHeader=styled.div`
    color:${props=>props.theme.white.lighter};
    height:20%;
    font-size:30px;
    font-weight:500;
    display: flex;
    align-items: center;
    padding:0px 50px;
`

export const Form=styled.form`
    height:45%;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const FormInput=styled.input`
    color:white;
    width: 300px;
    height:50px;
    background-color:#333333;
    border:none;
    border-radius: 8px;
    margin-bottom:10px;
    padding-left: 20px;
    ::placeholder{
        color:#8C8B8B;
        font-size:16px;
    }
`

export const FormFooter=styled.div`
    height:35%;
    display: flex;
    flex-direction: column;
    align-items: center;
    color:#8C8B8B;
    padding:0px 40px;
    word-break: keep-all;
    h1{
        margin-bottom:18px;
        a{
            color:white;
            font-size:15px;
            font-weight:500;
        }
    }
    h2{
        font-size:14px;
        line-height: 120%;
    }
`

export const FormButton=styled.button`
    background-color: #E50914;
    width: 300px;
    height:50px;
    border-radius: 8px;
    border: none;
    font-size:15px;
    color:${props=>props.theme.white.darker};
    &:hover{
        cursor: pointer;
        color:${props=>props.theme.black.darker}
    }
`

export const Detail=styled.span`
    color:#076FE5;
    &:hover{
        cursor: pointer;
    }
`;

export const MoreDetail=styled(motion.div)`
    margin-top:10px;
    line-height: 120%;
    a{
        color:#035DED;
    }
`

const DetailVariants = {
    initial: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
    leaving: { opacity: 0, scale: 0},
  };

const LoginSuccess=styled.div`
    font-size:20px;
    margin:10px 0px;
`

interface FormValues{
    email:string,
    password:string
}

function Login(){
    const [detail,setDetail]=useState(false)
    const { register, handleSubmit,formState:{errors},setError } = useForm<FormValues>();
    const [loginSuccess,setLoginSuccess]=useState(false);
    const [token,setToken]=useRecoilState(accessToken);
    const [savedMovie,setSavedMovie]=useRecoilState(movieList);
    const navigate=useNavigate();
    const onSubmit:SubmitHandler<FormValues> = data => {
        axiosPublic.post("/api/users/login",{
            email:data.email,
            password:data.password
        }).then(async res=>{
            if(res.data.loginSuccess){
                localStorage.setItem("accessToken",JSON.stringify(res.data.token));
                setToken(res.data.token);
                axiosPrivate.defaults.headers.common[
                    'Authorization'
                  ] = `Bearer ${res.data.token}`;
                setLoginSuccess(true);
                const {data}=await axiosPrivate.get('api/users/getmovie')
                setSavedMovie(data);
                setTimeout(()=>{
                    navigate('/watch/movie',{state:res.data.userName})
                },3000)
            }
            else{
                if(!res.data.hasUser)
                setError(
                    'password',
                    { message: res.data.message }, 
                    { shouldFocus: true }, 
                  );
                else{
                    setError(
                        'password',
                        { message: res.data.message }, 
                        { shouldFocus: true }, 
                      );
                }
            }
        });
    }
    const detailClicked=()=>{
        setDetail(prev=>!prev);
    }
    return <>
        <LoginHeader />
        <BackgroundWrapper>
            <FormWrapper>
                <FormHeader>
                    로그인
                </FormHeader>
                <Form onSubmit={handleSubmit(onSubmit)}>
                <FormInput style={{borderBottom:`${Boolean(errors.email)} ? "3px solid black" : "null" `}} {...register("email", { required: true,pattern: {
              value:
                /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
              message: "이메일 형식에 맞지 않습니다.",
            }, })} placeholder="이메일"></FormInput>
            {errors.email ? <Error>{errors?.email?.message}</Error> : null}
                    <FormInput {...register("password", { required: true,
                 })} placeholder="비밀번호" type="password" ></FormInput>
                    {errors.password ? <Error>{errors?.password?.message}</Error> : null}
                    {loginSuccess ? <><LoginSuccess>✅로그인 성공✅</LoginSuccess><div style={{fontSize:16}}>홈으로 이동합니다...</div></> : null}
                    <FormButton style={{marginTop:20}}>로그인</FormButton>
                </Form>
                <FormFooter>
                    <h1>
                        <span>Netflix 회원이 아닌가요? </span>
                        <Link to="/register"><span>지금 가입하세요.</span></Link>
                    </h1>
                    <h2>이 페이지는 Google reCAPTCHA의 보호를 받아 사용자가 로봇이 아님을 확인합니다.
                        {!detail ? <Detail onClick={detailClicked}>자세히 알아보기.</Detail> : null}
                        {detail ? <MoreDetail initial={{opacity:0}} animate={{opacity:1}}>Google reCAPTCHA가 수집하는 정보에는 Google <a href={PRIVACY_URL} target='_blank' rel='noreferrer'>개인정보처리방침</a>과 <a href={SERVICE_URL} target='_blank' rel='noreferrer'>서비스 약관</a>이 적용되며, 해당 정보는 reCAPTCHA 서비스 제공, 관리 및 개선과 일반적인 보안 유지에 사용됩니다(Google의 개인 맞춤 광고에 사용 안 함).</MoreDetail> : null}
                    </h2>
                </FormFooter>
            </FormWrapper>
        </BackgroundWrapper>
    </>
}

export default Login;