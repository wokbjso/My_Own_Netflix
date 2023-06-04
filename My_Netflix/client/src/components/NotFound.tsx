import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound(){
    const navigate=useNavigate();
    useEffect(()=>{
        setInterval(()=>{
            navigate('/watch/movie');
        },2000)
    },)
    return <h1>
        해당 페이지는 존재하지 않습니다. 
    </h1>
}

export default NotFound;