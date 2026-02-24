import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

/**
 * @component NotFound
 * @description Page affichée lorsqu'aucune route ne correspond.
 */
export default function NotFound() {
	return (
		<section className={styles.container}>
			<h1 className={styles.title}>404</h1>
			<p className={styles.message}>
				La page que vous recherchez n'existe pas.
			</p>
			<Link to="/dashboard" className={styles.link}>
				Retour au tableau de bord
			</Link>
		</section>
	);
}
