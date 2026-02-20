/**
 * @file router.jsx
 * @description
 * Définition centralisée des routes de l’application SportSee.
 *
 * Date : 14 février 2026
 */

import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Profile from "../pages/Profile.jsx";
import NotFound from "../pages/NotFound.jsx";


export const router = createBrowserRouter([
  {
    path: "/", element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "profile", element: <Profile /> }

    ]
  }
]);

