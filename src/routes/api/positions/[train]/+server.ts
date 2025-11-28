import { json } from '@sveltejs/kit';
import { getPositionsByTrainNumber } from '$lib/db';

export const GET = async ({ params, url }) => {
	try {
		const trainNumber = params.train;
		const hoursParam = url.searchParams.get('hours');
		const hours = hoursParam ? parseInt(hoursParam) : 20;

		if (!trainNumber) {
			return json({ error: 'Train number is required' }, { status: 400 });
		}

		return json(getPositionsByTrainNumber(trainNumber, hours));
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to fetch positions' }, { status: 500 });
	}
};
