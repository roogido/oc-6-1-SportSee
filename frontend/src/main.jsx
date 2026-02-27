/**
 * @file main.jsx
 * @description
 * Point d’entrée de l’application React.
 * Monte l’application React dans le DOM.
 *
 * Date : 14 février 2026
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import App from './App.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';


createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AuthProvider>
			<App />
		</AuthProvider>
	</StrictMode>,
);
