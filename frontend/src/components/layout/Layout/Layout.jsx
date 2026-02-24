/**
 * @file Layout.jsx
 * @description Composant structurel global de l’application SportSee.
 *
 * @author Salem Hadjali
 * @date 21-02-2026
 */

import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './Layout.module.css';

export default function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className={styles.viewport}>
      <div className={styles.app}>
        <Header variant={isLoginPage ? 'login' : 'app'} />

        <main className={styles.main}>
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}