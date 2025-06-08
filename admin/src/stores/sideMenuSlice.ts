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
      icon: "Users",
      title: "Medecins",
      pathname: "/medecins",
    },

    {
      icon: "Users",
      title: "rendez-vous",
      subMenu: [
        {
          icon: "Home",
          title: "Radiologues",
          pathname: "/appointments/radiologue",
        },
        {
          icon: "Users",
          title: "Prescripteurs",
          pathname: "/appointments/generaliste",
        },
      ],
    },
    {
      icon: "User",
      title: "Patients",
      subMenu: [
        {
          icon: "User",
          title: "Liste des Patients",
          pathname: "/Patient",
        },
      ],
    },
    
    {
      icon: "Package",
      title: "Centres",
      pathname: "/centres",
    },
    



    
    {
      icon: "Users",
      title: "Gestion des Utilisateur",
      subMenu: [
    {
      icon: "PersonStanding",
      title: "admins",
      pathname: "/admins",
        },
      ],
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
