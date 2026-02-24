// src/pages/Dashboard/index.jsx
import { useMemo } from 'react';

import { useUserInfo } from '../../hooks/useUserInfo';
import { useUserActivity } from '../../hooks/useUserActivity';

import ActivityChart from '../../components/ActivityChart/ActivityChart';
import WeeklyAverageChart from '../../components/WeeklyAverageChart/WeeklyAverageChart';

import { getLastNDaysRange } from '../../utils/dateRange';
import { buildWeeklyAverageDistance } from '../../data/selectors/weeklyAverageDistance';

import styles from './Dashboard.module.css';

function formatMemberSince(isoDate) {
	if (!isoDate) return '';
	const d = new Date(isoDate);
	if (Number.isNaN(d.getTime())) return '';
	return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function Dashboard() {
	const { data, isLoading, error } = useUserInfo();

	const { startDate, endDate } = getLastNDaysRange(28);

	const {
		data: activity28,
		isLoading: activityLoading,
		error: activityError,
	} = useUserActivity({ startWeek: startDate, endWeek: endDate });

	// ✅ Hooks toujours appelés, même si on return plus bas
	const memberSince = useMemo(() => {
		return data?.user?.createdAt ? formatMemberSince(data.user.createdAt) : '';
	}, [data]);

	const last7Days = useMemo(() => {
		if (!Array.isArray(activity28)) return [];
		const sorted = [...activity28].sort((a, b) => (a.dateIso > b.dateIso ? 1 : -1));
		return sorted.slice(-7);
	}, [activity28]);

	const weeklyAverageData = useMemo(() => {
		if (!Array.isArray(activity28)) return [];
		return buildWeeklyAverageDistance(activity28, endDate, 4);
	}, [activity28, endDate]);

	const weekDistanceKm = useMemo(() => {
		return last7Days.reduce((sum, d) => sum + (Number(d.distanceKm) || 0), 0);
	}, [last7Days]);

	const weekDurationMin = useMemo(() => {
		return last7Days.reduce((sum, d) => sum + (Number(d.durationMin) || 0), 0);
	}, [last7Days]);

	// ✅ Ensuite seulement : returns conditionnels
	if (isLoading || activityLoading) return <p className={styles.state}>Chargement...</p>;
	if (error) return <p className={styles.error}>Erreur user: {error.message}</p>;
	if (activityError) return <p className={styles.error}>Erreur activité: {activityError.message}</p>;
	if (!data) return <p className={styles.error}>Erreur: données utilisateur indisponibles.</p>;

	return (
		<div className={styles.dashboard}>
			<div className={styles.container}>
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
								{memberSince ? `Membre depuis le ${memberSince}` : ''}
							</div>
						</div>

						<div className={styles.distanceTotal}>
							<div className={styles.distanceLabel}>Distance totale parcourue</div>
							<div className={styles.distanceValue}>{data.stats.totalDistanceKm} km</div>
						</div>
					</div>
				</section>

				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>Vos dernières performances</h2>

					<div className={styles.twoCols}>
						<div className={styles.card}>
							<WeeklyAverageChart data={weeklyAverageData} />
						</div>

						<div className={styles.card}>
							<div className={styles.placeholder}>Graphique BPM (à intégrer)</div>
						</div>
					</div>
				</section>

				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>Cette semaine</h2>

					<div className={styles.weekGrid}>
						<div className={styles.card}>
							<div className={styles.placeholder}>Donut objectif (à intégrer)</div>
						</div>

						<div className={styles.card}>
							<div className={styles.kpiTitle}>Durée d’activité</div>
							<div className={styles.kpiValue}>{weekDurationMin} minutes</div>
						</div>

						<div className={styles.card}>
							<div className={styles.kpiTitle}>Distance</div>
							<div className={styles.kpiValue}>{weekDistanceKm.toFixed(1)} kilomètres</div>
						</div>
					</div>

					<div className={styles.sectionSpacer} />

					<div className={styles.card}>
						<ActivityChart data={last7Days} />
					</div>
				</section>
			</div>
		</div>
	);
}