import { useSelector,useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Nav } from './comp/Nav';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './components/ui/button';
import { ModeToggle } from './components/mode-toggle';
import { logout } from './slice/userSlice';

function App() {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const token = useSelector((state) => state.user.token);

  useEffect(()=>{
    if(!token) navigate("/signin") 
  },[])
  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };
  return (
    <div className="h-screen w-screen">
      {/* <ModeToggle/> */}
    { token && <Button onClick={handleLogout}>Logout</Button>}
      {token && <Nav />} 
      <div>
        
        <Outlet />
      </div>
    </div>
  );
}

export default App;
