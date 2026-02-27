/**
 * @file App.jsx
 * @description
 * Point d’entrée UI de l’application SportSee (frontend React).
 * Monte le système de routing
 *
 * Date : 14 février 2026
 */

import { RouterProvider } from 'react-router-dom';
import { router } from './router/router.jsx';

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;
