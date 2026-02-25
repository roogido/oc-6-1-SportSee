// src/pages/Profile/index.jsx
import { useMemo } from 'react';

import { useUserInfo } from '../../hooks/useUserInfo';
import { useUserActivity } from '../../hooks/useUserActivity';
import { parseIsoDateLocal } from '../../utils/isoDate';

import styles from './Profile.module.css';

const MS_DAY = 24 * 60 * 60 * 1000;

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

function inferGender(firstName) {
	if (firstName === 'Emma' || firstName === 'Sophie') return 'Femme';
	if (firstName === 'Marc') return 'Homme';
	return '—';
}

/**
 * Jours de repos sur la plage CHARGÉE (pas "depuis").
 * = nombre de jours entre 1ère et dernière session - nombre de jours ayant au moins 1 session.
 */
function computeRestDaysFromSessions(sessions) {
	if (!Array.isArray(sessions) || sessions.length < 2) return 0;

	const sorted = [...sessions].sort((a, b) => (a.dateIso > b.dateIso ? 1 : -1));
	const start = parseIsoDateLocal(sorted[0].dateIso);
	const end = parseIsoDateLocal(sorted[sorted.length - 1].dateIso);

	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;

	const totalDays = Math.floor((end - start) / MS_DAY) + 1;
	const activeDays = new Set(sorted.map((s) => s.dateIso)).size;

	return Math.max(0, totalDays - activeDays);
}

export default function Profile() {
	const { data, isLoading, error } = useUserInfo();

	// On charge large, comme Dashboard (robuste mock + API).
	// Les calculs se font côté front.
	const startDate = '2020-01-01';
	const endDate = '2030-12-31';

	const {
		data: activityAll,
		isLoading: activityLoading,
		error: activityError,
	} = useUserActivity({ startWeek: startDate, endWeek: endDate });

	const memberSince = useMemo(() => {
		return data?.user?.createdAt ? formatMemberSince(data.user.createdAt) : '';
	}, [data]);

	const gender = useMemo(() => {
		return inferGender(data?.user?.firstName ?? '');
	}, [data]);

	const computed = useMemo(() => {
		const sessions = Array.isArray(activityAll) ? activityAll : [];

		const totalDurationMin = sessions.reduce(
			(sum, s) => sum + (Number(s.durationMin) || 0),
			0
		);

		const totalCalories = sessions.reduce(
			(sum, s) => sum + (Number(s.calories) || 0),
			0
		);

		const totalSessions = sessions.length;

		const restDays = computeRestDaysFromSessions(sessions);

		return { totalDurationMin, totalCalories, totalSessions, restDays };
	}, [activityAll]);

	if (isLoading || activityLoading) return <p className={styles.state}>Chargement...</p>;
	if (error) return <p className={styles.error}>Erreur user: {error.message}</p>;
	if (activityError) return <p className={styles.error}>Erreur activité: {activityError.message}</p>;
	if (!data) return <p className={styles.error}>Erreur: données utilisateur indisponibles.</p>;

	// Profil: valeurs réelles (si absentes, fallback simple)
	const age = Number(data.user.age || 0) || 30;
	const heightCm = Number(data.user.heightCm || 0) || 170;
	const weightKg = Number(data.user.weightKg || 0) || 70;

	// Stats calculées sur période chargée
	const hours = Math.floor(computed.totalDurationMin / 60);
	const minutes = computed.totalDurationMin % 60;

	return (
		<div className={styles.profile}>
			<div className={styles.container}>
				<div className={styles.grid}>
					{/* LEFT COLUMN */}
					<div>
						<div className={styles.topCard}>
							<div className={styles.avatarWrap}>
								<img
									className={styles.avatar}
									src={data.user.profilePictureUrl ?? ''}
									alt={`${data.user.firstName} ${data.user.lastName}`}
								/>
							</div>

							<div>
								<div className={styles.userName}>
									{data.user.firstName} {data.user.lastName}
								</div>
								<div className={styles.memberSince}>
									Membre depuis le {memberSince}
								</div>
							</div>
						</div>

						<div className={styles.profileCard}>
							<h3 className={styles.cardTitle}>Votre profil</h3>
							<hr className={styles.separator} />

							<div className={styles.profileLine}>
								<span>Âge :</span> {age}
							</div>
							<div className={styles.profileLine}>
								<span>Genre :</span> {gender}
							</div>
							<div className={styles.profileLine}>
								<span>Taille :</span> {heightCm} cm
							</div>
							<div className={styles.profileLine}>
								<span>Poids :</span> {weightKg} kg
							</div>
						</div>
					</div>

					{/* RIGHT COLUMN */}
					<div>
						<h2 className={styles.sectionTitle}>Vos statistiques</h2>
						<div className={styles.sectionSubtitle}>Depuis le {memberSince}</div>

						<div className={styles.statsGrid}>
							<div className={styles.statCard}>
								<div className={styles.statLabel}>Temps total couru</div>
								<div className={styles.statValue}>
									{hours}h {minutes}min
								</div>
							</div>

							<div className={styles.statCard}>
								<div className={styles.statLabel}>Calories brûlées</div>
								<div className={styles.statValue}>{computed.totalCalories} cal</div>
							</div>

							{/* ✅ Source of truth = statistics.totalDistance */}
							<div className={styles.statCard}>
								<div className={styles.statLabel}>Distance totale parcourue</div>
								<div className={styles.statValue}>
									{Number(data.stats.totalDistanceKm || 0).toFixed(1)} km
								</div>
							</div>

							<div className={styles.statCard}>
								<div className={styles.statLabel}>Nombre de jours de repos</div>
								<div className={styles.statValue}>{computed.restDays} jours</div>
							</div>

							<div className={styles.statCard}>
								<div className={styles.statLabel}>Nombre de sessions</div>
								<div className={styles.statValue}>{computed.totalSessions} sessions</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}