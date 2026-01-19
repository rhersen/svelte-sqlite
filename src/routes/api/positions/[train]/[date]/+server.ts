import { json } from '@sveltejs/kit';
import { getPositionsByTrainNumber } from '$lib/db';

export const GET = async ({ params }) => {
	try {
		const trainNumber = params.train;
		const date = params.date;

		if (!trainNumber) {
			return json({ error: 'Train number is required' }, { status: 400 });
		}

		if (!date) {
			return json({ error: 'Date is required' }, { status: 400 });
		}

		return json(getPositionsByTrainNumber(trainNumber, date));
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to fetch positions' }, { status: 500 });
	}
};
