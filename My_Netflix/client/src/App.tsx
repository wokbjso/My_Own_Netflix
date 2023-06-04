import { Navigate, Route, Routes } from "react-router-dom";
import { useRecoilState } from "recoil";
import ProtectedRoute from "./AuthHoc/ProtectedRoute";
import RefuseAuth from "./AuthHoc/RefuseAuth";
import NotFound from "./components/NotFound";
import { accessToken } from "./recoil";
import About from "./Routes/About";
import Login from "./Routes/Login";
import Movie from "./Routes/Movie";
import Register from "./Routes/Register";
import Tv from "./Routes/Tv";

function App() {
  const [token,setToken]=useRecoilState(accessToken);
  return <Routes>
    <Route element={<RefuseAuth accessToken={token} />}>
      <Route path='/' element={<About />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Route>
    <Route element={<ProtectedRoute accessToken={token}/>}>
        <Route path='/watch/movie/*' element={<Movie />} />
        <Route path='/mymovie' element={<Movie />} />
        <Route path='/watch/tv' element={<Tv />} />
    </Route> 
    <Route path="*" element={<Navigate to="/404" />} />
    <Route path="/404" element={<NotFound />} />
  </Routes>
}

export default App;
