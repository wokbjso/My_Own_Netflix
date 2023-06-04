import styled from "styled-components";
import { motion,useScroll,Variants } from "framer-motion";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AboutHeader from "../components/AboutHeader";

export const BackgroundWrapper=styled.div`
    height:800px;
    display: flex;
    justify-content: center;
    align-items: center;
    background:linear-gradient(
            to right,
            rgba(20, 20, 20, 1) 10%,
            rgba(20, 20, 20, 0.4) 25%,
            rgba(20, 20, 20, 0.8) 50%,
            rgba(20, 20, 20, 0.4) 75%,
            rgba(20, 20, 20, 1) 100%
          ), url("https://assets.nflxext.com/ffe/siteui/vlv3/a43711df-c428-4f88-8bb3-b2ac5f20608f/c7cd631d-4f1f-46e1-b1a4-2ea3c93d9301/KR-ko-20230227-popsignuptwoweeks-perspective_alpha_website_large.jpg");
`

const Intro=styled(motion.div)`
    height:60%;
    width:50%;
    word-break: keep-all;
    font-weight:500;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h1{
        font-size:70px;
        margin-bottom:30px;
    }
    h2{
        font-size:25px;
        margin-bottom:40px;
    }
    h3{
        font-size:20px;
        margin-bottom:25px;
    }
`

const GoWatchBtn=styled(motion.button)`
    background-color:#E50914;
    border:none;
    width:300px;
    height:50px;
    border-radius: 8px;
    color:white;
    font-size:20px;
    font-weight:500;
    &:hover{
        cursor: pointer;
        color:${props=>props.theme.black.darker};
        scale: 1.05;
        transition:color 0.2s ease-in-out,scale 0.2s ease-in-out;
    }
`

const Board=styled(motion.div)`
    display: flex;
    justify-content: space-around;
    align-items: center;
    height:500px;
    padding:0px 15%;
    border-bottom: 8px solid #222;
`

const Introduce=styled.div`
    font-weight:500;
    width:50%;
    word-break: keep-all;
    h1{
        font-size:60px;
        margin-bottom:20px;
        line-height:130%;
    };
    h2{
        font-size:25px;
        line-height: 150%;
    }
`

const BoardImg=styled.img`
    width:50%;
`

const IntroVariants:Variants={
    start:{
        opacity:0
    },
    end:{
        opacity:1,
        transition:{
            duration:0.8
        }
    }
}

function About(){
    useEffect(() => {
        AOS.init(); 
      },[]);
    return <>
        <AboutHeader />
        <BackgroundWrapper>
            <Intro variants={IntroVariants} initial="start" animate="end">
                <h1>영화와 시리즈를 무제한으로.</h1>
                <h2>다양한 디바이스에서 시청하세요. 언제든 해지하실 수 있습니다.</h2>
                <h3>시청할 준비가 되셨나요?</h3>
                <GoWatchBtn>시청하기 &rarr;</GoWatchBtn>
            </Intro>
        </BackgroundWrapper>
        <Board data-aos="fade-up" data-aos-duration="2000">
            <Introduce>
                <h1>TV로 즐기세요.</h1>
                <h2>스마트 TV, PlayStation, Xbox, Chromecast, Apple TV, 블루레이 플레이어 등 다양한 디바이스에서 시청하세요.</h2>
            </Introduce>
            <BoardImg src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png"></BoardImg>
        </Board>
        <Board data-aos="fade-up" data-aos-duration="2000">
            <Introduce>
                <h1>다양한 디바이스에서 시청하세요.</h1>
                <h2>각종 영화와 시리즈를 스마트폰, 태블릿, 노트북, TV에서 무제한으로 스트리밍하세요. 추가 요금이 전혀 없습니다.</h2>
            </Introduce>
            <BoardImg src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/device-pile.png"></BoardImg>
        </Board>
        <Board data-aos="fade-up" data-aos-duration="2000">
            <Introduce>
                <h1>어린이 전용 프로필을 만들어 보세요.</h1>
                <h2>자기만의 공간에서 좋아하는 캐릭터와 즐기는 신나는 모험. 자녀에게 이 특별한 경험을 선물하세요. 넷플릭스 회원이라면 무료입니다.</h2>
            </Introduce>
            <BoardImg src="https://occ-0-988-325.1.nflxso.net/dnm/api/v6/19OhWN2dO19C9txTON9tvTFtefw/AAAABe3Dqef6rg30BxYraI75i97IeQjD0YxUuToAnSA23dl0XQFrjXaFTWIB0HHy4TH_s094NU-9IjLpE_96AvWpTZTAQOR_icyEYcsB.png?r=acf"></BoardImg>
        </Board>
        <Board data-aos="fade-up" data-aos-duration="2000">
            <Introduce>
                <h1>즐겨 보는 콘텐츠를 저장해 오프라인으로 시청하세요.</h1>
                <h2>광고 없는 멤버십에서만 이용 가능합니다.</h2>
            </Introduce>
            <BoardImg src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/mobile-0819.jpg"></BoardImg>
        </Board>
    </>
}

export default About;