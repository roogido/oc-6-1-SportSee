// src/pages/Dashboard/index.jsx
import { useMemo, useState } from 'react';

import outlineIcon from '../../assets/images/outline.png';

import { useUserInfo } from '../../hooks/useUserInfo';
import { useUserActivity } from '../../hooks/useUserActivity';

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

	const [kmOffsetBlocks, setKmOffsetBlocks] = useState(0);
	const [bpmOffsetWeeks, setBpmOffsetWeeks] = useState(0);

	const startDate = '2025-01-01';
	const endDate = '2025-12-31';

	const {
		data: activityAll,
		isLoading: activityLoading,
		error: activityError,
	} = useUserActivity({ startWeek: startDate, endWeek: endDate });

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

	const maxIso = useMemo(() => getMaxDateIsoOrEmpty(sortedAll), [sortedAll]);

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

	const weekKpis = useMemo(() => {
		const { startIso, endIso } = heartRateWeek?.range ?? {
			startIso: '',
			endIso: '',
		};
		if (startIso && endIso)
			return buildWeekKpis(sortedAll, { startIso, endIso });

		// fallback minimal si range vide (rare)
		return { distanceKm: 0, durationMin: 0, sessionsCount: 0 };
	}, [sortedAll, heartRateWeek]);

	const weekRangeText = useMemo(() => {
		const { startIso, endIso } = heartRateWeek?.range ?? {
			startIso: '',
			endIso: '',
		};
		return startIso && endIso
			? formatFullWeekRangeLabel(startIso, endIso)
			: '';
	}, [heartRateWeek]);

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
				</section>
			</div>
		</div>
	);
}
