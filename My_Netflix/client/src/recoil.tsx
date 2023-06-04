import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { axiosPrivate } from "./axios";

const { persistAtom } = recoilPersist();

interface IMovie{
  movieId:number,
  movieTitle:string
}

export interface IMovieList{
  movies:IMovie[]
}

const getAccessToken=()=>{
  const accessToken=JSON.parse(localStorage.getItem("accessToken")||"null");
  if (accessToken) {
    // 어세스토큰이 있으면 axios 인스턴스에 커먼 헤더로 집어넣음
    axiosPrivate.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${accessToken}`;

    return accessToken;
  }
  return null;
}

const getSavedMovie=async ()=>{
  const accessToken=JSON.parse(localStorage.getItem("accessToken")||"null");
  if(accessToken){
    const {data}=await axiosPrivate.get('api/users/getmovie')
    if(data) return data;
    return {movies:[]};
  }
}

export const welcome = atom({
    key: 'welcome',
    default: false,
    effects_UNSTABLE: [persistAtom],
});

export const accessToken = atom({
    key: 'accessToken',
    default: getAccessToken(),
});

export const movieList=atom<IMovieList>({
  key:'movieList',
  default:getSavedMovie(),
  effects_UNSTABLE: [persistAtom], 
})
