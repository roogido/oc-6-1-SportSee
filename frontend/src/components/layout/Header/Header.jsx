// src/components/layout/SiteHeader/SiteHeader.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
import logoHeader from '../../../assets/images/brand/logo-header.png';
import styles from './Header.module.css';

export default function Header({ variant = 'app' }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const isMock = import.meta.env.VITE_DATA_SOURCE === 'mock';

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  // Bloc logo + indicateur (réutilisé dans les 2 variantes)
  const Brand = (
    <div className={styles.brand}>
      <img className={styles.logo} src={logoHeader} alt="SportSee" />
      {isMock && (
        <span
          className={styles.dataSourceHint}
          aria-label="Source de données mock"
          title="Mode mock actif"
        >
          mock
        </span>
      )}
    </div>
  );

  // Variante login : pas de navigation
  if (variant === 'login') {
    return (
      <header className={styles.headerLogin}>
        {Brand}
      </header>
    );
  }

  return (
    <header className={styles.header}>
      {Brand}

      <nav className={styles.nav}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Mon profil</Link>

        {isAuthenticated && (
          <button
            className={styles.logout}
            type="button"
            onClick={handleLogout}
          >
            Se déconnecter
          </button>
        )}
      </nav>
    </header>
  );
}
