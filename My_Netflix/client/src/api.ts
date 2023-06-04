import axios from "axios";

const API_KEY="3d2cae94b6c951cbca22ec179cbfd37e";
const BASE_PATH="https://api.themoviedb.org/3";

export interface IMovie{
    id:number,
    backdrop_path:string,
    poster_path:string,
    title:string,
    overview:string,
    vote_average:number,
    release_date:string,
}

export interface IGetMoviesResult{
    dates:{
        maximum:string;
        minimum:string;
    };
    page:number,
    results:IMovie[],
    total_pages:number,
    total_results:number
}

export function getNowPlaying(){
    return axios.get(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then
    (res=>res.data);
}

export function getTopRating(){
    return axios.get(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then
    (res=>res.data);
}

export function getLatest(){
    return axios.get(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then
    (res=>res.data);
}