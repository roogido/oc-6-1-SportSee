/**
 * @file apiClient.js
 * @description Client HTTP centralisé basé sur fetch.
 * Gère les headers (JSON + Bearer), le parsing de réponse
 * et la levée d'erreurs ApiError pour les statuts non 2xx.
 *
 * @author 	Salem Hadjali
 * @date 	20-02-2026
 */


/**
 * Erreur spécifique aux appels API.
 * Contient le message, le status HTTP et les détails éventuels.
 *
 * @extends Error
 */
export class ApiError extends Error {
	/**
	 * @param {string} message
	 * @param {Object} [options]
	 * @param {number} [options.status=0]
	 * @param {*} [options.details=null]
	 */
	constructor(message, { status = 0, details = null } = {}) {
		super(message);
		this.name = 'ApiError'; // Permet de distinguer ce type d'erreur via instanceof
		this.status = status;
		this.details = details;
	}
}

/**
 * Construit les headers HTTP pour une requête fetch.
 * - Ajoute Content-Type JSON si un body est présent
 * - Ajoute Authorization Bearer si token fourni
 * - Permet de surcharger / compléter via extra
 *
 * @param {string|null} token
 * @param {Record<string, string>} [extra={}]
 * @param {boolean} [hasBody=false]
 * @returns {Record<string, string>}
 */
function buildHeaders(token, extra = {}, hasBody = false) {
	const headers = { ...extra };

	if (hasBody) {
		headers['Content-Type'] = 'application/json';
	}

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	return headers;
}

/**
 * Parse le body d'une Response de manière sûre.
 * - Retourne un objet si Content-Type JSON
 * - Retourne une string si non-JSON
 * - Retourne null si body vide
 *
 * @param {Response} res
 * @returns {Promise<unknown|string|null>}
 */
async function parseBody(res) {
	const contentType = res.headers.get('content-type') || '';

	// On se base sur le header plutôt que sur un try/catch JSON.parse
	if (contentType.includes('application/json')) {
		return res.json();
	}

	// text() est plus tolérant (évite les erreurs sur body vide ou non-JSON)
	const text = await res.text();
	return text || null;
}

/**
 * Wrapper centralisé autour de fetch :
 * - Ajoute headers (JSON + Bearer si token)
 * - Sérialise le body si nécessaire
 * - Parse la réponse (JSON si possible)
 * - Lance ApiError si status non 2xx
 *
 * @param {string|URL} path
 * @param {Object} [config]
 * @param {string} [config.method="GET"]
 * @param {*} [config.body=null]
 * @param {string|null} [config.token=null]
 * @param {Record<string, string>} [config.headers={}]
 * @returns {Promise<unknown|null|string>}
 * @throws {ApiError}
 */
export async function apiFetch(
	path,
	{ method = 'GET', body = null, token = null, headers = {} } = {},
) {
	const upperMethod = method.toUpperCase();

	// GET/HEAD ne doivent pas transporter de body : on n'ajoute le body et le Content-Type JSON
	// que pour les méthodes qui le permettent, et uniquement si un body est fourni.
	const hasBody =
		body !== null && upperMethod !== 'GET' && upperMethod !== 'HEAD';

	const finalHeaders = buildHeaders(token, headers, hasBody);

	const options = {
		method: upperMethod,
		headers: finalHeaders,
	};

	if (hasBody) {
		options.body = JSON.stringify(body);
	}

	const res = await fetch(path, options);

	// Parsing tolérant : évite de casser sur body vide / non-JSON (ex: 204, HTML d'erreur proxy, etc.)
	const data = await parseBody(res);

	if (!res.ok) {
		// On privilégie un message d'erreur renvoyé par l'API, sinon on fabrique un fallback exploitable.
		const message =
			(data && (data.message || data.error)) ||
			`HTTP ${res.status} on ${upperMethod} ${path}`;

		throw new ApiError(message, { status: res.status, details: data });
	}

	return data;
}
