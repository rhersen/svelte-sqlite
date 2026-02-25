import { json } from '@sveltejs/kit';
import { buildAnnouncementQuery, fetchTrafikverket } from '$lib/trafikverket';
import type { RequestHandler } from './$types';

type AnnouncementResultItem = {
	TrainAnnouncement?: unknown[];
};

export const GET: RequestHandler = async () => {
	try {
		const response = await fetchTrafikverket(buildAnnouncementQuery());
		const announcements = (
			response as unknown as { RESPONSE: { RESULT: AnnouncementResultItem[] } }
		).RESPONSE.RESULT.flatMap((item) => item.TrainAnnouncement ?? []);

		return json(announcements);
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to fetch announcements' }, { status: 500 });
	}
};
