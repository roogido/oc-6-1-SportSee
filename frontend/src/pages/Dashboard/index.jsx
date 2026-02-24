// src/pages/Dashboard/index.jsx
import { useUserInfo } from '../../hooks/useUserInfo';
import { useUserActivity } from '../../hooks/useUserActivity';
import ActivityChart from '../../components/ActivityChart/ActivityChart';
import { getLast7DaysRange } from '../../utils/dateRange';
import styles from './Dashboard.module.css';

function formatMemberSince(isoDate) {
	if (!isoDate) return '';
	const d = new Date(isoDate);
	if (Number.isNaN(d.getTime())) return '';
	return d.toLocaleDateString('fr-FR', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	});
}

export default function Dashboard() {
	const { data, isLoading, error } = useUserInfo();
	const { startWeek, endWeek } = getLast7DaysRange();

	const {
		data: activity,
		isLoading: activityLoading,
		error: activityError,
	} = useUserActivity({ startWeek, endWeek });

	if (isLoading || activityLoading)
		return <p className={styles.state}>Chargement...</p>;
	if (error)
		return <p className={styles.error}>Erreur user: {error.message}</p>;
	if (activityError)
		return (
			<p className={styles.error}>
				Erreur activité: {activityError.message}
			</p>
		);

	if (!data)
		return (
			<p className={styles.error}>
				Erreur: données utilisateur indisponibles.
			</p>
		);

	const memberSince = formatMemberSince(data.user.createdAt);
	const totalDistanceKm = data.stats.totalDistanceKm;

	const weekDistanceKm = Array.isArray(activity)
		? activity.reduce((sum, d) => sum + (Number(d.distanceKm) || 0), 0)
		: 0;

	const weekDurationMin = Array.isArray(activity)
		? activity.reduce((sum, d) => sum + (Number(d.durationMin) || 0), 0)
		: 0;

	return (
		<div className={styles.dashboard}>
			<div className={styles.container}>
				{/* 1) Carte user + distance totale */}
				<section className={styles.topRow}>
					<div className={styles.userCard}>
						<img
							className={styles.avatar}
							src={data.user.profilePictureUrl ?? ''}
							alt={`${data.user.firstName} ${data.user.lastName}`}
						/>
						<div className={styles.userMeta}>
							<div className={styles.userName}>
								{data.user.firstName} {data.user.lastName}
							</div>
							<div className={styles.userSince}>
								{memberSince
									? `Membre depuis le ${memberSince}`
									: ''}
							</div>
						</div>

						<div className={styles.distanceTotal}>
							<div className={styles.distanceLabel}>
								Distance totale parcourue
							</div>
							<div className={styles.distanceValue}>
								{totalDistanceKm} km
							</div>
						</div>
					</div>
				</section>

				{/* 2) Vos dernières performances (2 graphes) */}
				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>
						Vos dernières performances
					</h2>

					<div className={styles.twoCols}>
						<div className={styles.card}>
							<ActivityChart data={activity} />
						</div>

						<div className={styles.card}>
							{/* TODO: HeartRateChart (BPM) */}
							<div className={styles.placeholder}>
								Graphique BPM (à intégrer)
							</div>
						</div>
					</div>
				</section>

				{/* 3) Cette semaine (donut + 2 indicateurs) */}
				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>Cette semaine</h2>
					<div className={styles.weekGrid}>
						<div className={styles.card}>
							{/* TODO: GoalDonutChart */}
							<div className={styles.placeholder}>
								Donut objectif (à intégrer)
							</div>
						</div>

						<div className={styles.card}>
							<div className={styles.kpiTitle}>
								Durée d’activité
							</div>
							<div className={styles.kpiValue}>
								{weekDurationMin} minutes
							</div>
						</div>

						<div className={styles.card}>
							<div className={styles.kpiTitle}>Distance</div>
							<div className={styles.kpiValue}>
								{weekDistanceKm.toFixed(1)} kilomètres
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
