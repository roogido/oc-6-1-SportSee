// src/components/layout/SiteHeader/SiteHeader.jsx
import { NavLink, useNavigate } from 'react-router-dom';
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

  if (variant === 'login') {
    return <header className={styles.headerLogin}>{Brand}</header>;
  }

  const navLinkClass = ({ isActive }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

  return (
    <header className={styles.header}>
      {Brand}

      <nav className={styles.nav} aria-label="Navigation principale">
        <div className={styles.navLeft}>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/profile" className={navLinkClass}>
            Mon profil
          </NavLink>
        </div>

        {isAuthenticated && (
          <div className={styles.navRight}>
            <span className={styles.separator} aria-hidden="true" />
            <button
              className={styles.logout}
              type="button"
              onClick={handleLogout}
            >
              Se déconnecter
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
