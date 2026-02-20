/**
 * @file App.jsx
 * @description
 * Point d’entrée UI de l’application SportSee (frontend React).
 *
 * Date : 14 février 2026
 */

import { RouterProvider } from "react-router-dom";
import { router } from "./router/router.jsx";

export default function App() {
  return <RouterProvider router={router} />;
}
