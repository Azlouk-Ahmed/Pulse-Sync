import { selectDarkMode, setDarkMode } from "../../stores/darkModeSlice";
import { useAppSelector, useAppDispatch } from "../../stores/hooks";
import clsx from "clsx";
import Lucide from "../../base-components/Lucide";
import { useState } from "react";
function Main() {
  const [View, SetView] = useState(false);
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(selectDarkMode);

  const setDarkModeClass = () => {
    const el = document.querySelectorAll("html")[0];
    darkMode ? el.classList.add("dark") : el.classList.remove("dark");
  };

  const switchMode = () => {
    dispatch(setDarkMode(!darkMode));
    localStorage.setItem("darkMode", (!darkMode).toString());
    if (darkMode) {
      SetView(true);
    } else {
      SetView(false);
    }

    setDarkModeClass();
  };

  setDarkModeClass();

  return (
    <>
      {/* BEGIN: Dark Mode Switcher */}
      <div
        className=" top-0 right-1 z-60 flex items-center justify-center w-12 h-10 mb-1  border rounded-full shadow-md cursor-pointer "
        onClick={switchMode}
      >
        {View ? (
          <div className="item-center text-center text-slate-600 dark:text-slate-200">
            <Lucide icon="Moon" className="w-4 h-4" />
          </div>
        ) : (
          <div className="item-center text-center text-slate-600 dark:text-slate-200">
            <Lucide icon="SunMoon" className="w-4 h-4" />
          </div>
        )}
      </div>
      {/* END: Dark Mode Switcher */}
    </>
  );
}

export default Main;
