import { useRoutes } from "react-router-dom";
import React from "react";

// Only import SideMenu as it's been uncommented in your code
import SideMenu from "../layouts/SideMenu";

// Only uncomment the components we need for now
const Login = React.lazy(() => import("../pages/Login"));
const Appointments = React.lazy(() => import("../pages/Appointments.jsx"));
const Exams = React.lazy(() => import("../pages/Exams.jsx"));
const AppointmentDetails = React.lazy(() => import("../pages/appointment-details"));
const Profile = React.lazy(() => import("../pages/profile/Profile.jsx"));
const ErrorPage = React.lazy(() => import("../pages/ErrorPage"));


const DashboardPlaceholder = () => <div>Admin Dashboard (Placeholder)</div>;

const DashboardMedecins = React.lazy(() => import("../pages/DashboardMedecins"));


function Router() {
  const isloginAdmin = localStorage.getItem("authDoctor");
  
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
              <DashboardMedecins />
            </React.Suspense>
          ) : (
            <React.Suspense fallback={<>loading..</>}>
              <ErrorPage />
            </React.Suspense>
          ),
        },
        {
          path: "/dashboardmedecins",
          element: isloginAdmin ? (
            <React.Suspense fallback={<>loading..</>}>
              <DashboardMedecins />
            </React.Suspense>
          ) : (
            <React.Suspense fallback={<>loading..</>}>
              <ErrorPage />
            </React.Suspense>
          ),
        },
        {
          path: "/profile",
          element: isloginAdmin ? (
            <React.Suspense fallback={<>loading..</>}>
              <Profile />
            </React.Suspense>
          ) : (
            <React.Suspense fallback={<>loading..</>}>
              <ErrorPage />
            </React.Suspense>
          ),
        },
        {
          path: "/appointments",
          element: isloginAdmin ? (
            <React.Suspense fallback={<>loading..</>}>
                <Appointments />
            </React.Suspense>
          ) : (
            <React.Suspense fallback={<>loading..</>}>
              <ErrorPage />
            </React.Suspense>
          ),
        },
        {
          path: "/appointments/:id",
          element: isloginAdmin ? (
            <React.Suspense fallback={<>loading..</>}>
              <AppointmentDetails />
            </React.Suspense>
          ) : (
            <React.Suspense fallback={<>loading..</>}>
              <ErrorPage />
            </React.Suspense>
          ),
        },
        {
          path: "/examens",
          element: isloginAdmin ? (
            <React.Suspense fallback={<>loading..</>}>
              <Exams />
            </React.Suspense>
          ) : (
            <React.Suspense fallback={<>loading..</>}>
              <ErrorPage />
            </React.Suspense>
          ),
        },
        // All other admin routes are commented out for now
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