import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import styled from "styled-components";
import { makeImagePath } from "../utilities";
import { useRecoilState } from "recoil";
import { movieList } from "../recoil";
import { axiosPrivate } from "../axios";

interface MovieInterface{
    overview:string;
    backpath:string;
    title:string;
    movieId:number;
    movieTitle:string;
}

const MovieWrapper=styled(motion.div)`
    position:fixed;
    width:40vw;
    height: 80vh;
    top:0;
    bottom:0; 
    left:0;  
    right:0;
    margin:auto;
    background-color: ${props=>props.theme.black.lighter};
    border-radius: 20px;
    overflow: hidden;
`

const BookMark=styled.div`
    width: 100%;
    height:60px;
    padding-right:20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color:#FBC62C;
    font-size:30px;
    span{
        &:hover{
        transform-origin: right center;
        scale:1.1;
        transition:scale 0.2s ease-in;
        cursor: pointer;
    }
    }
`

const BigCover=styled.div`
    width:100%;
    height:400px;
    background-size: cover;
    background-position: center center;
`

const BigTitle=styled.h2`
    color:${props=>props.theme.white.lighter};
    font-size:35px;
    position:relative;
    top:-50px;
    padding:0px 10px;
`

const BigOverview=styled.p`
    padding:0px 20px;
    color:${props=>props.theme.white.lighter};
    font-size:18px;
    line-height: 130%;
`

function BigMovie({overview,backpath,title,movieId,movieTitle}:MovieInterface){
    const [savedMovie,setSavedMovie]=useRecoilState(movieList);
    const movieSaveClicked=()=>{
        const alreadyExists=savedMovie.movies.find(element=>element.movieId===movieId);
        if(!alreadyExists){
            axiosPrivate.post('api/users/addmovie',[
                ...savedMovie.movies,
                {movieId,movieTitle}
            ]).then(res=>{
                if(res.data.updateMovieList){
                    setSavedMovie(prev=>{
                        return {
                            movies:[
                                ...prev.movies,
                                {movieId,movieTitle}
                            ]
                        }
                    })
                }
            })
        }
    }
    return <MovieWrapper>
        <BookMark><span onClick={movieSaveClicked}><FontAwesomeIcon icon={faBookmark} /></span></BookMark>
        <BigCover style={{backgroundImage:`linear-gradient(to top,rgba(0, 0, 0, 0.8), transparent),url(${makeImagePath(backpath,"w500")})`}} />
        <BigTitle>{title}</BigTitle>
        <BigOverview>{overview}</BigOverview>
    </MovieWrapper>
}

export default BigMovie;