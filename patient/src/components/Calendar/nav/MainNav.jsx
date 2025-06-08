import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";
import { IoIosArrowBack, IoIosArrowForward, IoIosNotificationsOutline } from "react-icons/io";
import { RiFullscreenExitLine, RiFullscreenLine } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { useAuthContext } from "../../../hooks/useAuthContext";
import ModalContainer from "../../Modal/ModalContainer";
import NotificationsModal from "../../Modal/NotificationsModal";
import useModal from "../../../hooks/useModal";

function Nav() {
  const location = useLocation(); 
  const navigate = useNavigate();
    const { modalOpen, close, open } = useModal();

  const {auth} = useAuthContext();
  const [isFullscreen, setIsFullscreen] = useState(false);



  const handleFullscreen = () => {
    const elem = document.documentElement;

    if (!isFullscreen) {
      
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen(); 
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(); 
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen(); 
      }
      setIsFullscreen(true);
    } else {
      
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen(); 
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); 
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen(); 
      }
      setIsFullscreen(false);
    }
  };


  

  
  const currentPath = location.pathname
    .split("/")
    .filter((segment) => segment !== "") 
    .filter((item) => isNaN(item)); 

  
  const handleClick = (index) => {
    
    const pathTo = "/" + currentPath.slice(0, index + 1).join("/");
    navigate(pathTo); 
  };


  return (
    <div className="mandoub-nav flex gap-5 items-center justify-between">
        <ModalContainer>
                {modalOpen && (
                    <NotificationsModal
                        modalOpen={modalOpen}
                        handleClose={close}
                    />
                )}
        </ModalContainer>
      <div className=" flex gap-5 items-center !gap-6">
        <div id="nav-footer-heading">
          <div id="nav-footer-avatar">
          <img src={auth?.user.img? process.env.REACT_APP_UPLOADS_DIR+auth?.user.img : "/img/default.png"} alt="" />
          </div>
          <div id="nav-footer-titlebox">
            <div id="nav-footer-title"> {auth?.user.name}</div>
          </div>
          <label htmlFor="nav-footer-toggle">
            <i className="fas fa-caret-up"></i>
          </label>
        </div>
        <div className="nav-icon" onClick={open}>
          <IoIosNotificationsOutline />
          <div className="indicator" >
            <span>7</span>
          </div>
        </div>
        <div className="nav-icon" onClick={handleFullscreen} >
        {isFullscreen ? <RiFullscreenExitLine /> : <RiFullscreenLine />}
        </div>
      </div>

      {}
      <div className="path flex gap-5 items-center !gap-1">
        {currentPath.length > 0 ? (
          currentPath.map((segment, index) => (
            <React.Fragment key={index}>
              <span
                className={`breadcrumb-segment ${
                  index === currentPath.length - 1 ? "active-path" : ""
                }`} 
                onClick={() => handleClick(index)}
              >
                {segment}
              </span>
              {index < currentPath.length - 1 && (
                <IoIosArrowBack className="separator" />
              )}
            </React.Fragment>
          ))
        ) : (
          <span className="breadcrumb-segment active-path" onClick={() => navigate("/")}>
            main
          </span>
        )}
        <IoIosArrowForward className="separator" />
      </div>

      <div className="df">
        <div className="nav-icon">
          <CiLogout />
        </div>
      </div>
    </div>
  );
}

export default Nav;