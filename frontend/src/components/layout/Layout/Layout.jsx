/**
 * @file Layout.jsx
 * @description
 * Layout principal de l'application.
 * - Affiche Header + Footer sur toutes les routes
 * - Sauf sur /login (maquette full screen sans chrome global)
 *
 * @author Salem Hadjali
 * @date 21-02-2026
 */

import { Outlet, useLocation } from 'react-router-dom';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './Layout.module.css';


export default function Layout() {
	const { pathname } = useLocation();
	const isLogin = pathname === '/login' || pathname.startsWith('/login/');

	return (
		<div className={styles.viewport}>
			<div className={styles.app}>
				{!isLogin && <Header />}

				<main className={styles.main}>
					<Outlet />
				</main>

				{!isLogin && <Footer />}
			</div>
		</div>
	);
}
