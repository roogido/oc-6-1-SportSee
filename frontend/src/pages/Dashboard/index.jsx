// src/pages/Dashboard/index.jsx
import { useUserInfo } from '../../hooks/useUserInfo';
import { useUserActivity } from '../../hooks/useUserActivity';
import ActivityChart from '../../components/ActivityChart/ActivityChart';
import { getLast7DaysRange } from '../../utils/dateRange';
import styles from './Dashboard.module.css';

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
    return <p className={styles.error}>Erreur activité: {activityError.message}</p>;

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          {data.user.firstName} {data.user.lastName} —{' '}
          {data.stats.totalDistanceKm} km
        </h2>

        <div className={styles.grid}>
          {/* Colonne gauche */}
          <div className={styles.card}>
            <ActivityChart data={activity} />
          </div>

          {/* Colonne droite */}
          <div className={styles.kpiColumn}>
            <div className={styles.kpiCard} />
            <div className={styles.kpiCard} />
            <div className={styles.kpiCard} />
            <div className={styles.kpiCard} />
          </div>
        </div>
      </div>
    </div>
  );
}