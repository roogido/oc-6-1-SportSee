// src/components/WeeklyGoalDonut/WeeklyGoalDonut.jsx
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './WeeklyGoalDonut.module.css';

export default function WeeklyGoalDonut({ done = 0, goal = 6 }) {
	const safeGoal = Math.max(1, Number(goal) || 1);
	const safeDone = Math.min(safeGoal, Math.max(0, Number(done) || 0));
	const remaining = Math.max(0, safeGoal - safeDone);

	const data = [
		{ name: 'Réalisées', value: safeDone },
		{ name: 'Restantes', value: remaining },
	];

	return (
		<section className={styles.card} aria-label="Objectif hebdomadaire">
			<div className={styles.header}>
				<div className={styles.headline}>
					<span className={styles.times}>x{safeDone}</span>{' '}
					<span className={styles.headlineText}>sur objectif de</span>{' '}
					<span className={styles.goal}>{safeGoal}</span>
				</div>
				<div className={styles.subline}>Courses hebdomadaire réalisées</div>
			</div>

			<div className={styles.donutWrap}>
				<ResponsiveContainer width="100%" height={330}>
					<PieChart>
						<Pie
							data={data}
							dataKey="value"
							cx="50%"
							cy="50%"
							innerRadius={56}
							outerRadius={86}
							startAngle={90}
							endAngle={-270}
							stroke="none"
							paddingAngle={0}
						>
							<Cell fill="#1122F0" />
							<Cell fill="#B6BDFC" />
						</Pie>

						{/* Anneau blanc au centre */}
						<Pie
							data={[{ value: 1 }]}
							dataKey="value"
							cx="50%"
							cy="50%"
							innerRadius={0}
							outerRadius={44}
							fill="#ffffff"
							stroke="none"
							isAnimationActive={false}
						/>
					</PieChart>
				</ResponsiveContainer>

				<div className={styles.legend}>
					<div className={styles.legendItem}>
						<span className={`${styles.dot} ${styles.dotDone}`} />
						<span>{safeDone} réalisées</span>
					</div>
					<div className={styles.legendItem}>
						<span className={`${styles.dot} ${styles.dotRemaining}`} />
						<span>{remaining} restantes</span>
					</div>
				</div>
			</div>
		</section>
	);
}