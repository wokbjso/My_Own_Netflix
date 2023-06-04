import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion,Variants } from "framer-motion";
import { getNowPlaying, getTopRating, IGetMoviesResult } from "../api";
import { useQuery } from "react-query";
import { makeImagePath } from "../utilities";
import MovieTvHeader from "../components/MovieTvHeader";
import { useRecoilState } from "recoil";
import { welcome } from "../recoil";
import { faChevronLeft,faChevronRight, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BigMovie from "../components/BigMovie";

const UserModal=styled(motion.h1)`
    text-transform: uppercase;
    font-size:80px;
    width: 100%;
    text-align: center;
    background: -webkit-linear-gradient(#eee, #333);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`

const Wrapper = styled(motion.div)`
    padding-bottom: 100px;
    overflow: hidden;
`

const Banner = styled.div<{ bgphoto: string }>`
    height:100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding:60px;
    background-image: linear-gradient(rgba(0, 0,0,0), rgba(0,0,0,0.7)),url(${props => props.bgphoto});
`

const Title = styled.h2`
    font-size:60px;
    margin-bottom: 20px;
`

const Overview = styled.p`
    font-size:28px;
    width:50%;
`

const TopSlider=styled.div`
    position:relative;
    top:-200px;
`

const TopSliderTitle=styled.h1`
    position: relative;
    top:-230px;
    font-size:25px;
    font-weight:600;
    margin-left:5%;
`


const ArrowLeftIcon=styled.div`
    font-size:40px;
    width: 3%;
    position: absolute;
    z-index: 10;
    background-color:rgba(0,0,0,0.4);
    left:0;
    height:250px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover{
        cursor: pointer;
        color:gray;
        transition:color 0.15s ease-in
    }
`

const ArrowRightIcon=styled.div`
    font-size:40px;
    width: 3%;
    position: absolute;
    z-index: 10;
    background-color:rgba(0,0,0,0.4);
    right:0;
    height:250px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover{
        cursor: pointer;
        color:gray;
        transition:color 0.15s ease-in
    }
`

const Row=styled(motion.div)`
    display:grid;
    grid-template-columns: repeat(6,1fr);
    gap:10px;
    margin-bottom: 5px;
    position:absolute;
    width:100%;
`

const MovieBox=styled(motion.div)<{bphoto:string}>`
    background-color: white;
    height:250px;
    background-image: url(${props=>props.bphoto});
    background-size: cover;
    background-position: center center;
    cursor: pointer;
    &:first-child{
        transform-origin: center left;
    };
    &:last-child{
        transform-origin: center right;
    }
`

const Info=styled(motion.div)`
    padding:20px;
    background-color: ${props => props.theme.black.lighter};
    opacity:0;
    position: absolute;
    width:100%;
    bottom: 0;
    h4{
        text-align: center;
        font-size:18px;
        margin-bottom:10px;
        color:#E1AA88;
    }
    div:first-of-type{
        margin-bottom:8px;
        color:#43CA64;
        span{
            color:white;
        }
    }
`

export const WelcomeVariants:Variants={
    initial:{
        opacity:0,
    },
    animate:{
        opacity:1,
        transition:{
            duration:1
        }
    },
    exit:{
        opacity:0,
        transition:{
            duration:1
        }
    }
}

const RowVariants:Variants={
    initial:(back:boolean)=> {
        return {
            x: back ? -window.outerWidth : window.outerWidth
        }
    },
    animate: {
        x:0
    },
    exit:(back:boolean) => {
        return {
            x: back ? window.outerWidth : -window.outerWidth
        }
    }
}

const boxVariants:Variants={
    initial:{
        scale:1
    },
    hover:{
        y:-50,
        scale:1.3,
        transition: {
            delay: 0.2,
            type: "tween"
        }
    }
}

const infoVariants:Variants={
    hover: {
        opacity: 1,
        transition: {
            delay: 0.2,
            type: "tween"
        }
    }
}


function Movie(){
    const {state}=useLocation();
    const bigMovieMatch=useMatch('/watch/movie/:movieId');
    const [userWelcome,setUserWelcome]=useRecoilState(welcome);
    const { data:nowPlaying, isLoading:nowPlayingLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getNowPlaying);
    const { data:topRating, isLoading:topRatingLoading } = useQuery<IGetMoviesResult>(["movies", "topRating"], getTopRating);
    const bigMovieData = bigMovieMatch?.params.movieId && topRating?.results.find(movie => movie.id === Number(bigMovieMatch.params.movieId));
    const [index,setIndex]=useState(0);
    const [openBigMovie,setOpenBigMovie]=useState(false);
    const [leaving,setLeaving]=useState(false);
    const [back,setBack]=useState(false);
    const myMovieMatch=useMatch('/mymovie');
    const offset=6;
    const navigate=useNavigate();
    const toggleLeaving=()=>{
        setLeaving(prev=>!prev);
    }
    const onLeftArrow=()=>{
        if(topRating){
            if(leaving) return
            setLeaving(prev=>!prev);
            setBack(true);
            const totalMovies = topRating?.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex(prev => prev === 0 ? maxIndex : prev-1);
        }
    }
    const onRightArrow=()=>{
        if(topRating){
            if(leaving) return
            setLeaving(prev=>!prev);
            setBack(false);
            const totalMovies = topRating?.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex(prev => prev === maxIndex ? 0 : prev + 1);
        }
    }
    const movieBoxClick=(movieId:number)=>{
        if(openBigMovie) return;
        setOpenBigMovie(prev=>!prev);
        navigate(`/watch/movie/${movieId}`)
    }
    const exitBigMovie=()=>{
        if(!openBigMovie) return;
        navigate(-1);
        setOpenBigMovie(prev=>!prev);
    }
    useEffect(()=>{
        setTimeout(()=>{
        setUserWelcome(true);
    },2000);
    },[])
    useEffect(() => {
        const timer = setTimeout(() => {
          onRightArrow();
        }, 5000);
    
        return () => {
          clearTimeout(timer);
        };
      }, [index]);
    return <>
    <MovieTvHeader />
    <AnimatePresence>
        {!userWelcome ? <UserModal variants={WelcomeVariants} initial="initial" animate="animate" exit="exit">Welcome {state}</UserModal> : null}
    </AnimatePresence>
    {!userWelcome ? null : <><Wrapper variants={WelcomeVariants} initial="initial" animate="animate" exit="exit">
    <Banner onClick={exitBigMovie} bgphoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}>
        <Title>{nowPlaying?.results[0].title}</Title>
        <Overview>{nowPlaying?.results[0].overview}</Overview>
    </Banner>
    <TopSliderTitle>
        오늘 대한민국의 TOP 시리즈
    </TopSliderTitle>
    <TopSlider onClick={exitBigMovie}>
        <ArrowLeftIcon onClick={onLeftArrow}>
            <FontAwesomeIcon icon={faChevronLeft} />
        </ArrowLeftIcon>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving} custom={back}>
        <Row key={index}
        custom={back}
        variants={RowVariants} 
        initial="initial" 
        animate="animate" 
        exit="exit"
        transition={{type:"tween",duration:0.8}}
        >
            {topRating?.results.slice(2)
            .slice(offset*index,offset*index+offset)
            .map(movie=><MovieBox 
            onClick={()=>movieBoxClick(movie.id)}
            variants={boxVariants}
            initial="normal"
            transition={{ type: "tween" }}
            whileHover="hover"
            key={movie.id}
            layoutId={movie.id + ""}
            bphoto={makeImagePath(movie.backdrop_path || "", "w500")}
            >
                <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                    <div><span>Release date : </span>{movie.release_date}</div>
                    <div>
                        <FontAwesomeIcon icon={faStar} style={{marginRight:5,color:"yellow"}} />
                        {movie.vote_average}
                    </div>
                </Info>
            </MovieBox>)}
        </Row>
        </AnimatePresence>
        <ArrowRightIcon onClick={onRightArrow}>
            <FontAwesomeIcon icon={faChevronRight} />
        </ArrowRightIcon>
    </TopSlider>
    <AnimatePresence>
    {bigMovieMatch ? <BigMovie overview={bigMovieData ? bigMovieData.overview : ""}
    backpath={bigMovieData ? bigMovieData.backdrop_path : ""}
    title={bigMovieData ? bigMovieData.title : ""}
    movieId={bigMovieData ? bigMovieData.id : +""}
    movieTitle={bigMovieData ? bigMovieData.title : ""}></BigMovie> : null}
    </AnimatePresence>
    </Wrapper>
    </>}
    </>
}

export default Movie;