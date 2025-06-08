import Lucide from "../../base-components/Lucide";
import Breadcrumb from "../../base-components/Breadcrumb";
import { Menu, Popover } from "../../base-components/Headless";
import DarkMode from "../DarkModeSwitcher/DarkMode";
import { useAuthContext } from '../../hooks/useAuthContext.js';
import MainColorSwitcher from "../../components/MainColorSwitcher";



function Main() {
  const {dispatch} = useAuthContext();




  const deconnecter = async () => {
    try {
      localStorage.removeItem("authDoctor");
      window.location.href = "/";
      dispatch({ type: "LOGOUT"});
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      {/* BEGIN: Top Bar */}
      <div className="h-[67px] z-[51] flex items-center relative border-b border-slate-200">
        {/* BEGIN: Breadcrumb */}
        <MainColorSwitcher />
        <Breadcrumb className="hidden mr-auto -intro-x sm:flex">
          <Breadcrumb.Link to="/"></Breadcrumb.Link>
        </Breadcrumb>
        {/* END: Breadcrumb */}
        {/* BEGIN: Notifications */}

        {/* END: Notifications  */}
        <Popover className="mr-auto intro-x sm:mr-2">
          <DarkMode />
        </Popover>
        {/* BEGIN: Account Menu */}
        <Menu>
          <Menu.Button className="block w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x">
            <img
              alt="Midone Tailwind HTML Admin Template"
              src="/demo.svg"
            />
          </Menu.Button>
          <Menu.Items className="w-56 mt-px text-white bg-primary">
            <Menu.Divider className="bg-white/[0.08]" />
            <Menu.Item className="hover:bg-white/5" onClick={deconnecter}>
              <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" /> Deconnexion
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      {/* END: Top Bar */}
    </>
  );
}

export default Main;