// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import styles from './Login.module.css';

import bgImage from '../../assets/images/background-picture.png';

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from ?? '/dashboard';

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);

	async function handleSubmit(e) {
		e.preventDefault();
		setErrorMsg(null);
		setIsLoading(true);

		try {
			await login({ username, password });
			navigate(from, { replace: true });
		} catch (err) {
			const status =
				err?.status ?? err?.response?.status ?? err?.cause?.status;
			if (status === 401) setErrorMsg('Identifiants incorrects');
			else setErrorMsg('Erreur serveur');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className={styles.loginPage}>
			<section className={styles.left}>
				<div className={styles.card}>
					<h1 className={styles.title}>
						Transformez 
						<br />
						vos stats en résultats
					</h1>

					<h2 className={styles.subtitle}>Se connecter</h2>

					<form className={styles.form} onSubmit={handleSubmit}>
						<label className={styles.label} htmlFor="username">
							Nom d’utilisateur
							<input
								id="username"
								name="username"
								autoComplete="username"
								className={styles.input}
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</label>

						<label className={styles.label} htmlFor="password">
							Mot de passe
							<input
								id="password"
								name="password"
								autoComplete="current-password"
								className={styles.input}
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</label>

						{errorMsg && <p className={styles.error}>{errorMsg}</p>}

						<button
							className={styles.button}
							type="submit"
							disabled={isLoading}
						>
							{isLoading ? 'Connexion...' : 'Se connecter'}
						</button>

						<button
							className={styles.forgot}
							type="button"
							disabled
						>
							Mot de passe oublié ?
						</button>
					</form>
				</div>
			</section>

			<section
				className={styles.right}
				style={{ backgroundImage: `url(${bgImage})` }}
			>
				<div className={styles.imageHint}>
					Analysez vos performances en un clin d’œil,
					<br />
					suivez vos progrès et atteignez vos objectifs.
				</div>
			</section>
		</div>
	);
}
