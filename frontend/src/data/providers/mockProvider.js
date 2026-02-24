/**
 * @file mockProvider.js
 * @description
 * Fournisseur de données simulées (mock) pour le développement.
 * Reproduit l’interface du provider API afin de permettre
 * le basculement mock/API sans modifier la logique métier.
 *
 * Les données brutes sont transformées via des mappers
 * pour garantir un format cohérent dans l’application.
 * 
 * Date : 22-02-2026
 * 
 * @returns {Object} Un provider avec les méthodes async :
 * - getUserInfo()
 * - getUserActivity({ startWeek, endWeek })
 * - getProfileImage()
 */


import { getUserId } from '../../api/tokenStorage';

import user123Info from '../raw/users/user123.user-info.json';
import user123Activity from '../raw/users/user123.user-activity.json';

import user456Info from '../raw/users/user456.user-info.json';
import user456Activity from '../raw/users/user456.user-activity.json';

import user789Info from '../raw/users/user789.user-info.json';
import user789Activity from '../raw/users/user789.user-activity.json';

import { mapUserInfo } from '../mappers/userInfoMapper';
import { mapUserActivity } from '../mappers/userActivityMapper';

function delay(ms = 200) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const RAW_BY_USER = {
	user123: { info: user123Info, activity: user123Activity },
	user456: { info: user456Info, activity: user456Activity },
	user789: { info: user789Info, activity: user789Activity },
};

function getCurrentUserKeyOrThrow() {
	const userId = getUserId();

	if (!userId) {
		throw new Error('MockProvider: missing userId (not authenticated)');
	}

	const key = String(userId);

	if (!RAW_BY_USER[key]) {
		throw new Error(`MockProvider: unknown userId "${key}"`);
	}

	return key;
}

function isWithinRange(dateIso, startWeek, endWeek) {
	if (!startWeek || !endWeek) return true;
	return dateIso >= startWeek && dateIso <= endWeek;
}

export function createMockProvider() {
	return {
		async getUserInfo() {
			await delay();
			const key = getCurrentUserKeyOrThrow();
			return mapUserInfo(RAW_BY_USER[key].info);
		},

		async getUserActivity({ startWeek, endWeek } = {}) {
			await delay();
			const key = getCurrentUserKeyOrThrow();

			const sessions = RAW_BY_USER[key].activity;

			if (!Array.isArray(sessions)) {
				throw new Error('MockProvider: invalid activity payload (expected array)');
			}

			const filtered = sessions.filter((s) =>
				isWithinRange(s.date, startWeek, endWeek)
			);

			return mapUserActivity(filtered);
		},

		async getProfileImage() {
			await delay();
			throw new Error('Mock profile image not implemented in mock mode');
		},
	};
}
