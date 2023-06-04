import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { axiosPrivate } from "../axios";
import { movieList } from "../recoil";

const MovieListWrapper=styled(motion.ul)`
    position:absolute;
    margin-top:10px;
    right:20px;
    width:250px;
    background: linear-gradient(45deg, blue,transparent);
`

const MovieList=styled.li`
    width:100%;
    height:40px;
    color:white;
    display: flex;
    align-items:center;
    padding:25px 10px;
    font-size:16px;
    font-weight:500;
    word-break: keep-all;
    line-height: 20px;
`

const TrashIcon=styled.span`
    margin-left:5px;
    font-size:18px;
    &:hover{
        scale: 1.2;
        color:gray;
        cursor: pointer;
    }
`

const movieListWrapperVariants:Variants={
    initial:{
        opacity:0,
    },
    animate: {
        opacity: 1,
    },
    exit:{
        opacity:0
    }
}

function MyMovie(){
    const [savedMovieList,setSavedMovieList]=useRecoilState(movieList);
    const onDragEnd=(info:DropResult)=>{
        const {destination,source}=info;
        if(!destination) return;
        const copySavedMovieList=[...savedMovieList.movies];
        const target=savedMovieList.movies[source.index];
        copySavedMovieList.splice(source.index,1);
        copySavedMovieList.splice(destination.index,0,target);
        setSavedMovieList(allMovieList=>{
            return {
                movies:[
                    ...copySavedMovieList
                ]
            }
        })
        axiosPrivate.post('/api/users/addmovie',copySavedMovieList)
        .then(res=>{
            if(res.data.updateMovieList) return;
            alert(res.data.message);
        })
    }
    const trashClicked=(id:number)=>{
        const copySavedMovieList=[...savedMovieList.movies];
        const deleteList=copySavedMovieList.filter(movie=>movie.movieId!==id);
        setSavedMovieList(allMovieList=>{
            return {
                movies:[
                    ...deleteList
                ]
            }
        })
        axiosPrivate.post('/api/users/addmovie',deleteList)
        .then(res=>{
            if(res.data.updateMovieList) return;
            alert(res.data.message);
        })
    }
    return <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="movieListWrapper">
        {(provided,snapshot)=><MovieListWrapper
        ref={provided.innerRef}
        {...provided.droppableProps}
        variants={movieListWrapperVariants} 
        initial="initial" 
        animate="animate" 
        exit="exit" 
        key="mymovie"
        >
            {savedMovieList.movies.map((prev,index)=><Draggable key={prev.movieId+""} draggableId={prev.movieId+""} index={index}>
                {(provided,snapshot)=><MovieList
                key={prev.movieId}
                ref={provided.innerRef}
                {...provided.dragHandleProps}
                {...provided.draggableProps}
                >
               🎬 {prev.movieTitle} <TrashIcon onClick={()=>trashClicked(prev.movieId)}><FontAwesomeIcon icon={faTrash} /></TrashIcon>
                </MovieList>}
            </Draggable>
)}
            {provided.placeholder}
        </MovieListWrapper>}
        </Droppable></DragDropContext>
}

export default MyMovie;