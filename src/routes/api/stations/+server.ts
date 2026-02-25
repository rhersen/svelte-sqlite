import { json } from '@sveltejs/kit';
import { buildStationQuery, fetchTrafikverket } from '$lib/trafikverket';
import type { RequestHandler } from './$types';
import type { TrafikverketStationResponse } from '$lib/types';

export const GET: RequestHandler = async () => {
	try {
		const response = await fetchTrafikverket(buildStationQuery());
		const stations = (response as unknown as TrafikverketStationResponse).RESPONSE.RESULT.flatMap(
			(item) => item.TrainStation ?? []
		);
		const stationMap = Object.fromEntries(
			stations.map((station) => [station.LocationSignature, station])
		);

		return json(stationMap);
	} catch (error) {
		console.error(error);
		return json({ error: 'Failed to fetch stations' }, { status: 500 });
	}
};
