// src/components/layout/SiteFooter/SiteFooter.jsx
import logoFooter  from '../../../assets/images/brand/logo-footer.png';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <span>©Sportsee</span>
        <span>Tous droits réservés</span>
      </div>

      <div className={styles.right}>
        <a href="#" onClick={(e) => e.preventDefault()}>Conditions générales</a>
        <a href="#" onClick={(e) => e.preventDefault()}>Contact</a>
        <img className={styles.logo} src={logoFooter} alt="SportSee" />
      </div>
    </footer>
  );
}