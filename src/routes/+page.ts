import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/stats');
		const stats = await response.json();
		return { stats };
	} catch (error) {
		console.error('Failed to fetch stats:', error);
		return { stats: null, error: 'Failed to load statistics' };
	}
};
