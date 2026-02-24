import {
	ResponsiveContainer,
	ComposedChart,
	Bar,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from 'recharts';

import styles from './HeartRateChart.module.css';

function CustomTooltip({ active, payload, label }) {
	if (!active || !payload || payload.length === 0) return null;

	const min = payload.find((p) => p.dataKey === 'min')?.value;
	const max = payload.find((p) => p.dataKey === 'max')?.value;
	const avg = payload.find((p) => p.dataKey === 'avg')?.value;

	return (
		<div className={styles.tooltip}>
			<div className={styles.tooltipTitle}>{label}</div>
			<div>Min: {min} BPM</div>
			<div>Max: {max} BPM</div>
			<div>Moy: {avg} BPM</div>
		</div>
	);
}

export default function HeartRateChart({
	titleValue,
	rangeLabel,
	data,
	onPrev,
	onNext,
}) {
	const chartData = Array.isArray(data) ? data : [];

	return (
		<section className={styles.card}>
			<header className={styles.header}>
				<div>
					<div className={styles.headline}>
						<span className={styles.value}>{titleValue}</span>{' '}
						<span className={styles.unit}>BPM</span>
					</div>
					<p className={styles.subline}>
						Fréquence cardiaque moyenne
					</p>
				</div>

				<div className={styles.rangePicker} aria-label="Période">
					<button
						type="button"
						className={styles.rangeBtn}
						aria-label="Période précédente"
						onClick={onPrev}
						disabled={!onPrev}
					>
						‹
					</button>

					<span className={styles.rangeLabel}>{rangeLabel}</span>

					<button
						type="button"
						className={styles.rangeBtn}
						aria-label="Période suivante"
						onClick={onNext}
						disabled={!onNext}
					>
						›
					</button>
				</div>
			</header>

			<div className={styles.chartArea}>
				<ResponsiveContainer width="100%" height={330}>
					<ComposedChart
						data={chartData}
						barCategoryGap={24}
						barGap={6}
						margin={{ top: 10, right: 18, left: 6, bottom: 10 }}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							vertical={false}
							stroke="#D9D9D9"
							strokeWidth={1}
						/>

						<XAxis
							dataKey="dayLabel"
							tickLine={false}
							axisLine={{
								stroke: '#000',
								strokeWidth: 1,
								shapeRendering: 'crispEdges',
							}}
							tick={{ fontSize: 12, fill: '#8C8C8C' }}
						/>

						<YAxis
							tickLine={false}
							axisLine={{
								stroke: '#000',
								strokeWidth: 1,
								shapeRendering: 'crispEdges',
							}}
							tick={{ fontSize: 12, fill: '#8C8C8C' }}
							domain={['dataMin - 5', 'dataMax + 5']}
						/>

						<Tooltip cursor={false} content={<CustomTooltip />} />

						<Bar
							dataKey="min"
							barSize={10}
							radius={[10, 10, 10, 10]}
							className={styles.barMin}
						/>
						<Bar
							dataKey="max"
							barSize={10}
							radius={[10, 10, 10, 10]}
							className={styles.barMax}
						/>

						<Line
							type="monotone"
							dataKey="avg"
							stroke="#d9dae6"
							strokeWidth={2}
							dot={{
								r: 3,
								fill: '#1F2CFF', // même bleu que ta légende dotAvg
								stroke: '#1F2CFF', // bord du point
								strokeWidth: 0,
							}}
							activeDot={{
								r: 4,
								fill: '#1F2CFF',
								stroke: '#1F2CFF',
								strokeWidth: 0,
							}}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>

			<div className={styles.legend} aria-label="Légende">
				<div className={styles.legendItem}>
					<span className={`${styles.legendDot} ${styles.dotMin}`} />
					<span>Min</span>
				</div>

				<div className={styles.legendItem}>
					<span className={`${styles.legendDot} ${styles.dotMax}`} />
					<span>Max BPM</span>
				</div>

				<div className={styles.legendItem}>
					<span className={`${styles.legendDot} ${styles.dotAvg}`} />
					<span>Max BPM</span>
				</div>
			</div>
		</section>
	);
}
