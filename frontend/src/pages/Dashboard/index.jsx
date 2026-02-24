// src/pages/Dashboard/index.jsx
import { useMemo, useState } from 'react';

import { useUserInfo } from '../../hooks/useUserInfo';
import { useUserActivity } from '../../hooks/useUserActivity';

import ActivityChart from '../../components/ActivityChart/ActivityChart';
import WeeklyAverageChart from '../../components/WeeklyAverageChart/WeeklyAverageChart';
import HeartRateChart from '../../components/HeartRateChart/HeartRateChart';

import { buildWeeklyAverageDistance } from '../../data/selectors/weeklyAverageDistance';
import { buildLastIsoWeekHeartRate } from '../../data/selectors/heartRateWeek';

import { parseIsoDateLocal, toIsoDateLocal } from '../../utils/isoDate';

import styles from './Dashboard.module.css';

function formatShortRangeLabel(startIso, endIso) {
	if (!startIso || !endIso) return '';

	const start = parseIsoDateLocal(startIso);
	const end = parseIsoDateLocal(endIso);

	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '';

	const startStr = start
		.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
		.replace('.', '');
	const endStr = end
		.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
		.replace('.', '');

	return `${startStr} - ${endStr}`;
}

function formatMemberSince(isoDate) {
	if (!isoDate) return '';
	const d = parseIsoDateLocal(isoDate);
	if (Number.isNaN(d.getTime())) return '';
	return d.toLocaleDateString('fr-FR', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	});
}

/**
 * Renvoie la dateIso max d'un tableau de sessions mappées.
 */
function getMaxDateIsoOrEmpty(sessions) {
	if (!Array.isArray(sessions) || sessions.length === 0) return '';
	let max = '';
	for (const s of sessions) {
		if (typeof s?.dateIso !== 'string') continue;
		if (!max || s.dateIso > max) max = s.dateIso;
	}
	return max;
}

export default function Dashboard() {
	const { data, isLoading, error } = useUserInfo();

	// Offsets UI
	// - KM: pas de 4 semaines (28 jours) pour coller au graphe "Distance moyenne"
	// - BPM: pas de 1 semaine
	const [kmOffsetBlocks, setKmOffsetBlocks] = useState(0); // 1 block = 4 semaines
	const [bpmOffsetWeeks, setBpmOffsetWeeks] = useState(0); // 1 = 1 semaine

	// On charge "large" pour être robuste en mock + API.
	// Le slicing/offset se fait côté selectors, pas via le backend.
	const startDate = '2025-01-01';
	const endDate = '2025-12-31';

	const {
		data: activityAll,
		isLoading: activityLoading,
		error: activityError,
	} = useUserActivity({ startWeek: startDate, endWeek: endDate });

	// --- Derived ---
	const memberSince = useMemo(() => {
		return data?.user?.createdAt ? formatMemberSince(data.user.createdAt) : '';
	}, [data]);

	const sortedAll = useMemo(() => {
		if (!Array.isArray(activityAll)) return [];
		return [...activityAll].sort((a, b) => (a.dateIso > b.dateIso ? 1 : -1));
	}, [activityAll]);

	// Date de référence (dernière date dispo) => stable mock/API
	const maxIso = useMemo(() => getMaxDateIsoOrEmpty(sortedAll), [sortedAll]);

	// "Cette semaine" (KPI + ActivityChart) : on prend les 7 dernières sessions dispo
	// (on ne peut pas faire "7 jours" car dataset non quotidien)
	const last7Sessions = useMemo(() => {
		if (!sortedAll.length) return [];
		return sortedAll.slice(-7);
	}, [sortedAll]);

	const weekDistanceKm = useMemo(() => {
		return last7Sessions.reduce((sum, d) => sum + (Number(d.distanceKm) || 0), 0);
	}, [last7Sessions]);

	const weekDurationMin = useMemo(() => {
		return last7Sessions.reduce((sum, d) => sum + (Number(d.durationMin) || 0), 0);
	}, [last7Sessions]);

	// --- KM chart (Distance moyenne) ---
	// On décale la date de référence par blocs de 28 jours.
	const kmEndIso = useMemo(() => {
		if (!maxIso) return '';
		const d = parseIsoDateLocal(maxIso);
		d.setDate(d.getDate() + kmOffsetBlocks * 28);
		return toIsoDateLocal(d);
	}, [maxIso, kmOffsetBlocks]);

	const weeklyAverageData = useMemo(() => {
		if (!sortedAll.length || !kmEndIso) return [];
		return buildWeeklyAverageDistance(sortedAll, kmEndIso, 4);
	}, [sortedAll, kmEndIso]);

	// Label KM (facultatif mais utile si ton composant affiche une plage)
	const kmLabel = useMemo(() => {
		// buildWeeklyAverageDistance est sur 4 semaines, donc on affiche une plage de 28 jours
		if (!kmEndIso) return '';
		const end = parseIsoDateLocal(kmEndIso);
		const start = new Date(end);
		start.setDate(start.getDate() - 27);
		return formatShortRangeLabel(toIsoDateLocal(start), kmEndIso);
	}, [kmEndIso]);

	// --- BPM chart ---
	// On décale la semaine ISO via bpmOffsetWeeks
	const heartRateWeek = useMemo(() => {
		if (!sortedAll.length) return { range: { startIso: '', endIso: '' }, days: [] };
		return buildLastIsoWeekHeartRate(sortedAll, bpmOffsetWeeks);
	}, [sortedAll, bpmOffsetWeeks]);

	const bpmAverage = useMemo(() => {
		const days = heartRateWeek.days;
		if (!days.length) return 0;
		const avg = days.reduce((sum, d) => sum + (Number(d.avg) || 0), 0) / days.length;
		return Math.round(avg);
	}, [heartRateWeek]);

	const bpmRangeLabel = useMemo(() => {
		const { startIso, endIso } = heartRateWeek.range;
		return formatShortRangeLabel(startIso, endIso);
	}, [heartRateWeek]);

	// --- Returns conditionnels ---
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

					<div className={styles.performanceGrid}>
						<WeeklyAverageChart
							data={weeklyAverageData}
							rangeLabel={kmLabel}
							onPrev={() => setKmOffsetBlocks((v) => v - 1)}
							onNext={() => setKmOffsetBlocks((v) => v + 1)}
						/>

						<HeartRateChart
							titleValue={bpmAverage}
							rangeLabel={bpmRangeLabel}
							data={heartRateWeek.days}
							onPrev={() => setBpmOffsetWeeks((v) => v - 1)}
							onNext={() => setBpmOffsetWeeks((v) => v + 1)}
						/>
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
						<ActivityChart data={last7Sessions} />
					</div>
				</section>
			</div>
		</div>
	);
}
