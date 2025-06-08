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

export interface SideMenuAdminState {
  menu: Array<Menu | "divider">;
}

const initialState: SideMenuAdminState = {
  menu: [
    {
      icon: "PieChart",
      title: "Tableau de Board",
      pathname: "/admin/dashboard",
    },
    {
      icon: "Users",
      title: "Medecins",
      subMenu: [
        {
          icon: "Home",
          title: "Dashboard Medecins",
          pathname: "/admin/dashboardmedecins",
        },
        {
          icon: "Users",
          title: "Liste des Médecins",
          pathname: "/admin/medecin",
        },
      ],
    },
    {
      icon: "User",
      title: "Patients",
      subMenu: [
        {
          icon: "Home",
          title: "Dashboard Patient",
          pathname: "/admin/dashboardPatient",
        },
        {
          icon: "User",
          title: "Listes des Patients",
          pathname: "/admin/Patient",
        },
      ],
    },
    
    {
      icon: "Package",
      title: "Dossier Médical",
      pathname: "/admin/customer",
    },

    {
      icon: "Layers",
      title: "Rendez-Vous",
      pathname: "/admin/rendezvous",
    },

   
    {
      icon: "Users",
      title: "Gestion des Utilisateur  ",
      subMenu: [
    {
      icon: "PersonStanding",
      title: "Liste des Roles",
      pathname: "/admin/role",
        },
      ],
    },
  ],
};

export const sideMenuAdminSlice = createSlice({
  name: "sideMenuAdmin",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenuAdmin.menu;

export default sideMenuAdminSlice.reducer;
