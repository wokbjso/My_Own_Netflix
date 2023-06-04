import { Navigate, Outlet } from "react-router-dom"

const RefuseAuth=({accessToken}:any)=>{
    if(accessToken){
        return <Navigate to="/watch/movie" replace />
    }

    return <Outlet />;
}

export default RefuseAuth;