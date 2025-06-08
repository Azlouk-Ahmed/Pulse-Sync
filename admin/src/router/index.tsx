import { useRoutes } from "react-router-dom";
import React from "react";

// Only import SideMenu as it's been uncommented in your code
import SideMenu from "../layouts/SideMenu";

// Only uncomment the components we need for now
const Login = React.lazy(() => import("../pages/Login"));
const Register = React.lazy(() => import("../pages/Register"));
const ErrorPage = React.lazy(() => import("../pages/ErrorPage"));
const DashboardOverview1 = React.lazy(() => import("../pages/DashboardOverview1"));
const RadiologuesPage = React.lazy(() => import("../pages/RadiologuesPage"));
const CenterPage = React.lazy(() => import("../pages/Centres/CenterPage"));
const GeneralisteRdv = React.lazy(() => import("../pages/rendezvous/GeneralistesRdv.jsx"));
const RadiologuesRdv = React.lazy(() => import("../pages/rendezvous/Rdiologues.jsx"));
const AdminPage = React.lazy(() => import("../pages/adminPage/AdminsPage.jsx"));
const PatientPage = React.lazy(() => import("../pages/patientPage/index.jsx"));


// Define placeholder components for admin section
const DashboardPlaceholder = () => <div>Admin Dashboard (Placeholder)</div>;

// Commented components (to be implemented later)
// import SideMenuSousAdmin from "../layouts/SideMenu/indexsousadmin";
// import SideMenuAdmin from "../layouts/SideMenu/indexadmin";
// import AddMedecin from "../pages/Medecin/AddMedecin";
// import ListMedecin from "../pages/Medecin/ListMedecin";
// import ListPatient from "../pages/Patient/ListPatient";
// import ListRendezVous from "../pages/Rendez-Vous/ListRendezVous";
// import AddRendezVous from "../pages/Rendez-Vous/AddRendezVous";

// const DashboardOverview1 = React.lazy(() => import("../pages/DashboardOverview1"));
// const DashboardMedecins = React.lazy(() => import("../pages/DashboardMedecins"));
// const DashboardPatient = React.lazy(() => import("../pages/DashboardPatient"));
// const ListClient = React.lazy(() => import("../pages/Customer/ListCustomer"));
// const AddCustomer = React.lazy(() => import("../pages/Customer/AddCustomer"));
// const Roles = React.lazy(() => import("../pages/Roles/Roles"));
// const FeedPatient = React.lazy(() => import("../pages/Patient/FeedPatient"));
// const UpdateCustomer = React.lazy(() => import("../pages/Customer/UpdateCustomer"));
// const Calendar = React.lazy(() => import ("../pages/Calendar"));
// const Chat = React.lazy(() => import ("../pages/Chat"));
// const Notification = React.lazy(() => import ("../pages/Notification"));

function Router() {
  const isloginAdmin = JSON.parse(localStorage.getItem("authAdmin"));
  console.log("isloginAdmin", isloginAdmin);
  
  const routes = [
    // Default route - Login page
    {
      path: "/",
      element: (
        <React.Suspense fallback={<>loading..</>}>
          <Login />
        </React.Suspense>
      ),
    },
    
    // Admin dashboard section (simplified)
    {
      path: "/",
      element: isloginAdmin ? (
        <React.Suspense fallback={<>loading..</>}>
          <SideMenu />
        </React.Suspense>
      ) : (
        <React.Suspense fallback={<>loading..</>}>
          <ErrorPage />
        </React.Suspense>
      ),
      children: [
        {
          path: "/dashboard",
          element: isloginAdmin ? (
            <React.Suspense fallback={<>loading..</>}>
              <DashboardOverview1 />
            </React.Suspense>
          ) : (
            <React.Suspense fallback={<>loading..</>}>
              <ErrorPage />
            </React.Suspense>
          ),
        },
        {
          path: "/medecins",
          element: isloginAdmin ? (
            <React.Suspense fallback={<>loading..</>}>
              <RadiologuesPage />
            </React.Suspense>
          ) : (
            <React.Suspense fallback={<>loading..</>}>
              <ErrorPage />
            </React.Suspense>
          ),
        },
        {
          path: "/centres",
          element: isloginAdmin ? (
            <React.Suspense fallback={<>loading..</>}>
              <CenterPage />
            </React.Suspense>
          ) : (
            <React.Suspense fallback={<>loading..</>}>
              <ErrorPage />
            </React.Suspense>
          ),
        },
        {
          path: "/appointments/generaliste",
          element: isloginAdmin ? (
            <React.Suspense fallback={<>loading..</>}>
              <GeneralisteRdv />
            </React.Suspense>
          ) : (
            <React.Suspense fallback={<>loading..</>}>
              <ErrorPage />
            </React.Suspense>
          ),
        },
        {
          path: "/Patient",
          element: isloginAdmin ? (
            <React.Suspense fallback={<>loading..</>}>
              <PatientPage />
            </React.Suspense>
          ) : (
            <React.Suspense fallback={<>loading..</>}>
              <ErrorPage />
            </React.Suspense>
          ),
        },
        {
          path: "/appointments/radiologue",
          element: isloginAdmin ? (
            <React.Suspense fallback={<>loading..</>}>
              <RadiologuesRdv />
            </React.Suspense>
          ) : (
            <React.Suspense fallback={<>loading..</>}>
              <ErrorPage />
            </React.Suspense>
          ),
        },
        {
          path: "/admins",
          element: isloginAdmin && isloginAdmin.user.role === "superAdmin" ? (
            <React.Suspense fallback={<>loading..</>}>
              <AdminPage />
            </React.Suspense>
          ) : (
            <React.Suspense fallback={<>loading..</>}>
              <ErrorPage />
            </React.Suspense>
          ),
        },
      ],
    },
    
    // Authentication and error pages
    {
      path: "/login",
      element: (
        <React.Suspense fallback={<>loading..</>}>
          <Login />
        </React.Suspense>
      ),
    },
    {
      path: "/register",
      element: (
        <React.Suspense fallback={<>loading..</>}>
          <Register />
        </React.Suspense>
      ),
    },
    {
      path: "/error-page",
      element: (
        <React.Suspense fallback={<>loading..</>}>
          <ErrorPage />
        </React.Suspense>
      ),
    },
    {
      path: "*",
      element: (
        <React.Suspense fallback={<>loading..</>}>
          <ErrorPage />
        </React.Suspense>
      ),
    },
  ];

  return useRoutes(routes);
}

export default Router;