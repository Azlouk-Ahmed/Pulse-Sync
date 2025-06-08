import Nav from "../components/Calendar/nav/MainNav";
import Sidebar from "../components/sidebar/SideBar";
import { Outlet } from 'react-router-dom';

function Home() {
  return (
    <div><Sidebar />
        <div id="main-content" className="h-screen overflow-y-scroll !pt-0">
            <Nav />
            <Outlet />
            
        </div>
    </div>
  )
}

export default Home