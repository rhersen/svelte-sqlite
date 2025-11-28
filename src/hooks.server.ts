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
	streams.connectAnnouncement();
	cleanup.startJob();
	console.log('App initialized.');
};

await initializeApp();

// Handle graceful shutdown
process.on('SIGTERM', () => {
	console.log('SIGTERM received, closing streams and cleanup job...');
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
	// Middleware code here (optional)
	return await resolve(event);
};
