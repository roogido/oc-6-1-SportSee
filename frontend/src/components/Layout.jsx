/**
 * @file Layout.jsx
 * @description
 * Composant structurel global de l’application SportSee.
 *
 * Rôle :
 *   - Fournir une structure commune à toutes les pages.
 *   - Afficher les éléments persistants (navigation, header, sidebar, etc.).
 *   - Définir une zone dynamique via <Outlet /> où les pages s’affichent.
 *
 * IMPORTANT :
 *   - Layout ne décide PAS quelle page afficher.
 *   - Il fournit simplement le cadre dans lequel la page sera injectée.
 *
 * Ce mécanisme repose sur le "routing imbriqué" (nested routing).
 *
 * Date : 14 février 2026
 */

import { Outlet, Link } from "react-router-dom";

/**
 * Layout principal de l'application.
 *
 * Il est utilisé comme "route parent" dans router.jsx :
 *
 * {
 *   path: "/",
 *   element: <Layout />,
 *   children: [...]
 * }
 *
 * Cela signifie que toutes les routes enfants
 * seront affichées à l’intérieur du Layout.
 */
export default function Layout() {

  return (
    <div style={{ padding: 24 }}>

      {/* 
        Navigation principale.
        
        <Link> est un composant React Router.
        IMPORTANT :
        - Il remplace <a href="...">.
        - Il change l’URL sans recharger la page.
        - Il permet une navigation SPA (Single Page Application).
        
        Si tu utilisais <a>, la page se rechargerait.
      */}
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>

        {/* 
          Chaque Link correspond à une route définie dans router.jsx.
          
          to="/login"
          correspond à :
          { path: "login", element: <Login /> }
        */}
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>

      </nav>

      {/* 
        <Outlet /> est la zone dynamique.
        
        C'est LE point crucial du Layout.
        
        Ce composant est remplacé automatiquement par :
          - <Login /> si l’URL est /login
          - <Dashboard /> si l’URL est /dashboard
          - <Profile /> si l’URL est /profile
        
        Sans <Outlet />, les routes enfants ne s'afficheraient jamais.
      */}
      <Outlet />

    </div>
  );
}
