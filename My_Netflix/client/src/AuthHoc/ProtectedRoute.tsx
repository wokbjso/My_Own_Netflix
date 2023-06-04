import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute=({accessToken}:any)=>{
    if(!accessToken){
        return <Navigate to="/login" replace />
    }

    return <Outlet />;
}

export default ProtectedRoute;