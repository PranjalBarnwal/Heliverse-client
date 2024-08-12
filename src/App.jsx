import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Nav } from './comp/Nav';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function App() {
  const navigate=useNavigate();
  const token = useSelector((state) => state.user.token);
  useEffect(()=>{
    if(!token) navigate("/signin") 
  },[])
  return (
    <div className="h-screen w-screen">
      {token && <Nav />} 
      <div>
        Hello
        <Outlet />
      </div>
    </div>
  );
}

export default App;
