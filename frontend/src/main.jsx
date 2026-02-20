/**
 * @file main.jsx
 * @description
 * Point d’entrée de l’application React.
 *
 * Date : 14 février 2026
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
