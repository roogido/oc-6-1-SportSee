// src/components/WeekKpi/WeekKpi.jsx
import styles from './WeekKpi.module.css';

export default function WeekKpi({ label, value, unit, accent = 'blue' }) {
	return (
		<section className={styles.card} aria-label={label}>
			<div className={styles.label}>{label}</div>

			<div className={`${styles.value} ${styles[`accent_${accent}`]}`}>
				{value} <span className={styles.unit}>{unit}</span>
			</div>
		</section>
	);
}