// src/components/layout/SiteHeader/SiteHeader.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
import logoHeader from '../../../assets/images/brand/logo-header.png';
import styles from './Header.module.css';

export default function Header({ variant = 'app' }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  // Variante login : juste le logo, pas de nav
  if (variant === 'login') {
    return (
      <header className={styles.headerLogin}>
        <img className={styles.logo} src={logoHeader} alt="SportSee" />
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <img className={styles.logo} src={logoHeader} alt="SportSee" />

      <nav className={styles.nav}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Mon profil</Link>

        {isAuthenticated && (
          <button className={styles.logout} type="button" onClick={handleLogout}>
            Se déconnecter
          </button>
        )}
      </nav>
    </header>
  );
}