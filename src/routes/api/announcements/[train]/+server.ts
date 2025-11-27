import { json } from '@sveltejs/kit';
import { getAnnouncementsByTrainIdent } from '$lib/db';

export const GET = async ({ params, url }) => {
	try {
		const trainIdent = params.train;
		const hoursParam = url.searchParams.get('hours');
		const hours = hoursParam ? parseInt(hoursParam) : 1;

		if (!trainIdent) {
			return json({ error: 'Train ident is required' }, { status: 400 });
		}

		return json(getAnnouncementsByTrainIdent(trainIdent, hours));
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to fetch announcements' }, { status: 500 });
	}
};
