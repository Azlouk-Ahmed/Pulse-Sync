import { useState, useEffect } from "react";
import Lucide from "../../base-components/Lucide";
import Breadcrumb from "../../base-components/Breadcrumb";
import { Menu, Popover } from "../../base-components/Headless";
import clsx from "clsx";
import DarkMode from "../DarkModeSwitcher/DarkMode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PackageMinus } from 'lucide-react';
import { useAuthContext } from '../../hooks/useAuthContext.js';
import MainColorSwitcher from "../../components/MainColorSwitcher";



function Main() {
  const {dispatch} = useAuthContext();
  const navigate = useNavigate();
  const key = "isconnected";
  const accesstoken = localStorage.getItem("accesstoken");

  const [currentAdmin, setCurrentAdmin] = useState<any>([]);
  const [notificationStock, setNotificationStock] = useState([]);

  const getCurrentAdmin = async () => {
    try {
      const response = await axios.get(`${process.env.DASH_API_URL}/info`, {
        headers: {
          "content-type": "application/json; charset=utf-8",
          Authorization: accesstoken,
        },
      });
      setCurrentAdmin(response?.data?.employe);
    } catch (error: any) {
      if (error?.response?.data?.msg === "Invalid Authentication") {
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("isconnected");
        localStorage.removeItem("admin");
        window.location.href = "/";
      }
    }
  };

  const deconnecter = async () => {
    try {
      localStorage.removeItem("authAdmin");
      window.location.href = "/";
      dispatch({ type: "LOGOUT"});
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNotificationStock = async () => {
    try {
      const response = await axios.get(`${process.env.DASH_API_URL}/notification_stock`);
      setNotificationStock(response?.data?.result);
    } catch (error) {
      console.error(error);
    }
  };

  const updateNotificationStock = async (id: any) => {
    try {
      await axios.put(`${process.env.DASH_API_URL}/update_notification_stock/${id}`);
      fetchNotificationStock();
    } catch (error) {
      console.error(error);
    }
  };

  const navigateNotificationStock = (id: any) => {
    navigate(`/feed_stock/${id}`);
  };

  const navigateNotificationStockAdmin = (id: any) => {
    navigate(`/admin/feed_stock/${id}`);
  };

  useEffect(() => {
    getCurrentAdmin();
    fetchNotificationStock();
  }, [accesstoken]);

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
        <Popover className="mr-auto intro-x sm:mr-6">
          {currentAdmin?.roles?.name === "Supper_admin" || currentAdmin?.roles?.name === "Administration" ? (
            notificationStock.length !== 0 && (
              <Popover.Button
                className="relative text-slate-600 outline-none block before:content-[''] before:w-[8px] before:h-[8px] before:rounded-full before:absolute before:top-[-2px] before:right-0 before:bg-danger"
              >
                <Lucide icon="Bell" className="w-5 h-5 dark:text-slate-500" />
              </Popover.Button>
            )
          ) : null}
          <Popover.Panel className="w-[280px] sm:w-[350px] p-5 mt-2">
            <div className="mb-5 font-medium">Notifications</div>
            {notificationStock.length !== 0 && (
              <>
                <div className="mb-2 font-extrabold text-primary">Alert Minimum Stock</div>
                {notificationStock.map((n: any, index: any) => (
                  <div
                    key={index}
                    className={clsx([
                      "cursor-pointer relative flex items-center",
                      { "mt-1": index },
                    ])}
                    onClick={() => {
                      updateNotificationStock(n?._id);
                      if (currentAdmin?.roles?.name === "Supper_admin") {
                        navigateNotificationStock(n?.article?._id);
                      } else if (currentAdmin?.roles?.name === "Administration") {
                        navigateNotificationStockAdmin(n?.article?._id);
                      }
                    }}
                  >
                    <PackageMinus />
                    <div className="ml-2 overflow-hidden">
                      <div className="flex items-center">
                        <p className="mr-5 font-medium truncate">
                          {n?.typeNotification} d'article de {n?.article?.designation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </Popover.Panel>
        </Popover>
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
            <Menu.Header className="font-normal">
              <div className="font-medium">{currentAdmin.login}</div>
            </Menu.Header>
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