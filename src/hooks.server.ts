import type { Handle } from '@sveltejs/kit';
import * as db from '$lib/db';
import * as streams from '$lib/streams';
import * as cleanup from '$lib/cleanup';

console.log('Server is starting...');

// Initialize database, load config, etc.
const initializeApp = async () => {
	console.log('Initializing app...');
	db.initialize();
	// Start background jobs
	streams.connectPosition();
	cleanup.startJob();
	console.log('App initialized.');
};

await initializeApp();

// Handle graceful shutdown
process.on('SIGHUP', () => {
	console.log('SIGHUP received, closing streams and cleanup job...');
	cleanup.stopJob();
	streams.disconnectAll();
	process.exit(0);
});

process.on('SIGINT', () => {
	console.log('SIGINT received, closing streams and cleanup job...');
	cleanup.stopJob();
	streams.disconnectAll();
	process.exit(0);
});

// This runs on every request
export const handle: Handle = async ({ event, resolve }) => {
	// Add CORS headers for GET requests only
	if (event.request.method === 'OPTIONS') {
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET',
				'Access-Control-Allow-Headers': 'Content-Type'
			}
		});
	}

	const response = await resolve(event);

	// Add CORS headers to all responses
	response.headers.set('Access-Control-Allow-Origin', '*');
	response.headers.set('Access-Control-Allow-Methods', 'GET');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

	return response;
};
