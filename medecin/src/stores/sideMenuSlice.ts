import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

const initialState: SideMenuState = {
  menu: [
    {
      icon: "PieChart",
      title: "Tableau de Board",
      pathname: "/dashboard",
    },
    {
      icon: "AlarmCheck",
      title: "Rendez Vous",
      pathname: "/appointments",
    },
    {
      icon: "HeartPulse",
      title: "examen",
      pathname: "/examens",
    },
    {
      icon: "User",
      title: "profile",
      pathname: "/profile",
    },

  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
