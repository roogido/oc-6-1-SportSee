// src/pages/Dashboard/index.jsx
import { useMemo, useState } from 'react';

import outlineIcon from '../../assets/images/outline.png';

import { useUserInfo } from '../../hooks/useUserInfo';
import { useUserActivity } from '../../hooks/useUserActivity';

import ActivityChart from '../../components/ActivityChart/ActivityChart';
import WeeklyAverageChart from '../../components/WeeklyAverageChart/WeeklyAverageChart';
import HeartRateChart from '../../components/HeartRateChart/HeartRateChart';

import { buildWeeklyAverageDistance } from '../../data/selectors/weeklyAverageDistance';
import { buildLastIsoWeekHeartRate } from '../../data/selectors/heartRateWeek';
import { buildWeekKpis } from '../../data/selectors/weekKpis';

import WeeklyGoalDonut from '../../components/WeeklyGoalDonut/WeeklyGoalDonut';
import WeekKpi from '../../components/WeekKpi/WeekKpi';

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

function formatFullWeekRangeLabel(startIso, endIso) {
	if (!startIso || !endIso) return '';

	const start = parseIsoDateLocal(startIso);
	const end = parseIsoDateLocal(endIso);

	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '';

	const fmt = (d) =>
		d.toLocaleDateString('fr-FR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});

	return `Du ${fmt(start)} au ${fmt(end)}`;
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
		return data?.user?.createdAt
			? formatMemberSince(data.user.createdAt)
			: '';
	}, [data]);

	const sortedAll = useMemo(() => {
		if (!Array.isArray(activityAll)) return [];
		return [...activityAll].sort((a, b) =>
			a.dateIso > b.dateIso ? 1 : -1,
		);
	}, [activityAll]);

	// Date de référence (dernière date dispo) => stable mock/API
	const maxIso = useMemo(() => getMaxDateIsoOrEmpty(sortedAll), [sortedAll]);

	// "Cette semaine" (fallback si besoin) : 7 dernières sessions dispo
	const last7Sessions = useMemo(() => {
		if (!sortedAll.length) return [];
		return sortedAll.slice(-7);
	}, [sortedAll]);

	// --- KM chart (Distance moyenne) ---
	// Décale la date de référence par blocs de 28 jours.
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

	const kmLabel = useMemo(() => {
		if (!kmEndIso) return '';
		const end = parseIsoDateLocal(kmEndIso);
		const start = new Date(end);
		start.setDate(start.getDate() - 27);
		return formatShortRangeLabel(toIsoDateLocal(start), kmEndIso);
	}, [kmEndIso]);

	// --- BPM chart ---
	const heartRateWeek = useMemo(() => {
		if (!sortedAll.length)
			return { range: { startIso: '', endIso: '' }, days: [] };
		return buildLastIsoWeekHeartRate(sortedAll, bpmOffsetWeeks);
	}, [sortedAll, bpmOffsetWeeks]);

	const bpmAverage = useMemo(() => {
		const days = heartRateWeek.days;
		if (!days.length) return 0;
		const avg =
			days.reduce((sum, d) => sum + (Number(d.avg) || 0), 0) /
			days.length;
		return Math.round(avg);
	}, [heartRateWeek]);

	const bpmRangeLabel = useMemo(() => {
		const { startIso, endIso } = heartRateWeek.range;
		return formatShortRangeLabel(startIso, endIso);
	}, [heartRateWeek]);

	// --- Cette semaine (donut + KPI) ---
	const weekKpis = useMemo(() => {
		const { startIso, endIso } = heartRateWeek?.range ?? {
			startIso: '',
			endIso: '',
		};

		if (startIso && endIso) {
			return buildWeekKpis(sortedAll, { startIso, endIso });
		}

		// fallback: agrégats sur les 7 dernières sessions
		return {
			distanceKm: last7Sessions.reduce(
				(sum, s) => sum + (Number(s.distanceKm) || 0),
				0,
			),
			durationMin: last7Sessions.reduce(
				(sum, s) => sum + (Number(s.durationMin) || 0),
				0,
			),
			sessionsCount: last7Sessions.length,
		};
	}, [sortedAll, heartRateWeek, last7Sessions]);

	const weekRangeText = useMemo(() => {
		const { startIso, endIso } = heartRateWeek?.range ?? {
			startIso: '',
			endIso: '',
		};

		if (startIso && endIso)
			return formatFullWeekRangeLabel(startIso, endIso);

		// fallback (si jamais la range BPM est vide) : on ne force pas un rendu faux
		return '';
	}, [heartRateWeek]);

	// --- Returns conditionnels ---
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

	return (
		<div className={styles.dashboard}>
			<div className={styles.container}>
				<section className={styles.topRow}>
					<div className={styles.userCard}>
						<div className={styles.avatarWrap}>
							<img
								className={styles.avatar}
								src={data.user.profilePictureUrl ?? ''}
								alt={`${data.user.firstName} ${data.user.lastName}`}
							/>
						</div>

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

						<div className={styles.distanceWrapper}>
							<div className={styles.distanceRightLabel}>
								Distance totale parcourue
							</div>

							<div className={styles.distancePill}>
								<img
									src={outlineIcon}
									alt=""
									className={styles.distanceIcon}
									aria-hidden="true"
								/>
								<span className={styles.distancePillValue}>
									{data.stats.totalDistanceKm} km
								</span>
							</div>
						</div>
					</div>
				</section>

				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>
						Vos dernières performances
					</h2>

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

					{weekRangeText ? (
						<div className={styles.sectionSubtitle}>
							{weekRangeText}
						</div>
					) : null}

					<div className={styles.weekGrid}>
						<WeeklyGoalDonut
							done={weekKpis.sessionsCount}
							goal={6}
						/>

						<div className={styles.weekKpiColumn}>
							<WeekKpi
								label="Durée d’activité"
								value={weekKpis.durationMin}
								unit="minutes"
								accent="blue"
							/>
							<WeekKpi
								label="Distance"
								value={weekKpis.distanceKm.toFixed(1)}
								unit="kilomètres"
								accent="orange"
							/>
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
