import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosPublic from "../axios";
import RegisterHeader from "../components/RegisterHeader";
import { PRIVACY_URL, SERVICE_URL } from "../URL/url";
import { BackgroundWrapper } from "./About";
import { Detail, Form, FormButton, FormFooter, FormHeader, FormInput, FormWrapper, MoreDetail } from "./Login";

interface FormValues{
    name:string,
    email:string,
    password:string,
    checkpassword:string
}

export const Error=styled.div`
    font-size:14px;
    margin-bottom:12px;
    margin-top:5px;
    color:#E87C03;
    width: 300px;
`

const RegisterSuccess=styled.div`
    font-size:20px;
    margin:10px 0px;
`

const AlreadyRegistered=styled.div`
    font-size:20px;
    margin:10px 0px;
`

function Register(){
    const [detail,setDetail]=useState(false);
    const detailClicked=()=>{
        setDetail(prev=>!prev);
    };
    const [registerSuccess,setRegisterSuccess]=useState(false);
    const [areadyRegistered,setAlreadyRegistered]=useState(false);
    const { register, handleSubmit, formState: { errors },setError } = useForm<FormValues>();
    const navigate = useNavigate();
    const onSubmit:SubmitHandler<FormValues> = data => {
        if (data.password !== data.checkpassword) {      
            setError(
              'checkpassword',
              { message: '비밀번호가 일치하지 않습니다.' }, 
              { shouldFocus: true }, 
            );
            return;
        }
        axiosPublic.post("/api/users/register",{
            name:data.name,
            email:data.email,
            password:data.password
        })
        .then(res=>{
            if(res.data.success){
                setAlreadyRegistered(false);
                setRegisterSuccess(true);
                setTimeout(()=>{
                    navigate('/login')
                },3000)
            }
            else{
                setAlreadyRegistered(true);
            }
        });
    };
    return <>
    <RegisterHeader />
    <BackgroundWrapper>
        <FormWrapper>
            <FormHeader>
                회원가입
            </FormHeader>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormInput {...register("name", { required: true,
                    maxLength:{value:20,message:"이름이 너무 깁니다."},
                    minLength:{value:2,message:"이름이 너무 짧습니다."} })} placeholder="이름"></FormInput>
                {errors.name ? <Error>{errors?.name?.message}</Error> : null}
                <FormInput {...register("email", { required: true,pattern: {
              value:
                /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
              message: "이메일 형식에 맞지 않습니다.",
            }, })} placeholder="이메일"></FormInput>
                {errors.email ? <Error>{errors?.email?.message}</Error> : null}
                <FormInput {...register("password", { required: true,
                    maxLength:{value:15, message:"비밀번호가 너무 깁니다."},
                    minLength: {value: 8, message: "비밀번호가 너무 짧습니다."},
                    pattern:{value:/^(?=.*\d)(?=.*[a-zA-ZS]).{8,}/,message:"영문과, 숫자를 혼용하여 입력해주세요."} })} placeholder="비밀번호" type="password"></FormInput>
                {errors.password ? <Error>{errors?.password?.message}</Error> : null}
                <FormInput {...register("checkpassword", { required: true })} placeholder="비밀번호 다시 입력" type="password"></FormInput>
                {errors.checkpassword ? <Error>{errors?.checkpassword?.message}</Error> : null}
                {registerSuccess ? <><RegisterSuccess>✅회원가입 성공✅</RegisterSuccess><div style={{fontSize:16}}>로그인 페이지로 이동합니다...</div></> : null}
                {areadyRegistered ? <AlreadyRegistered>❗이미 가입된 이메일입니다.❗</AlreadyRegistered> : null}
                <FormButton style={{marginTop:10}}>회원가입</FormButton>
            </Form>
            <FormFooter style={{marginTop:"30px"}}>
                    <h2>이 페이지는 Google reCAPTCHA의 보호를 받아 사용자가 로봇이 아님을 확인합니다.
                        {!detail ? <Detail onClick={detailClicked}>자세히 알아보기.</Detail> : null}
                        {detail ? <MoreDetail initial={{opacity:0}} animate={{opacity:1}}>Google reCAPTCHA가 수집하는 정보에는 Google <a href={PRIVACY_URL} target='_blank' rel='noreferrer'>개인정보처리방침</a>과 <a href={SERVICE_URL} target='_blank' rel='noreferrer'>서비스 약관</a>이 적용되며, 해당 정보는 reCAPTCHA 서비스 제공, 관리 및 개선과 일반적인 보안 유지에 사용됩니다(Google의 개인 맞춤 광고에 사용 안 함).</MoreDetail> : null}
                    </h2>
            </FormFooter>
        </FormWrapper>
    </BackgroundWrapper>
    </>
}

export default Register;