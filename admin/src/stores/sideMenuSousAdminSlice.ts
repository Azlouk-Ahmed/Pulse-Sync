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

export interface SideMenuSousAdminState {
  menu: Array<Menu | "divider">;
}

const initialState: SideMenuSousAdminState = {
  menu: [

    {
      icon: "Home",
      title: "Liste des Médecins",
      pathname: "/sous-admin/medecin",
    },
    {
      icon: "Home",
      title: "Listes des Patients",
      pathname: "/sous-admin/Patient",
    },
    {
      icon: "Home",
      title: "Dossier Médical",
      pathname: "/sous-admin/customer",
    },
    
  ],
};

export const sideMenuSousAdminSlice = createSlice({
  name: "sideMenuSousAdmin",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenuSousAdmin.menu;

export default sideMenuSousAdminSlice.reducer;
