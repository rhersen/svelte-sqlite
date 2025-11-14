import { json } from '@sveltejs/kit';
import { getAnnouncementsByLimit } from '$lib/db';

export const GET = async ({ url }) => {
	try {
		const limit = parseInt(url.searchParams.get('limit') || '100');

		return json(getAnnouncementsByLimit(limit));
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to fetch announcements' }, { status: 500 });
	}
};
