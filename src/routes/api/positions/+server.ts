import { json } from '@sveltejs/kit';
import { getPositionsBySpeed } from '$lib/db';

export const GET = async ({ url }) => {
	try {
		const speed = parseFloat(url.searchParams.get('speed') || '2');

		return json(getPositionsBySpeed(speed));
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to fetch positions' }, { status: 500 });
	}
};
