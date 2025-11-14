import { json } from '@sveltejs/kit';
import { getPositionsByLimit } from '$lib/db';

export const GET = async ({ url }) => {
	try {
		const limit = parseInt(url.searchParams.get('limit') || '100');

		return json(getPositionsByLimit(limit));
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to fetch positions' }, { status: 500 });
	}
};
