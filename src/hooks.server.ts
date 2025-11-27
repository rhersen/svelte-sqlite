import type { Handle } from '@sveltejs/kit';
import * as db from '$lib/db';
import * as streams from '$lib/streams';

console.log('Server is starting...');

// Initialize database, load config, etc.
const initializeApp = async () => {
	console.log('Initializing app...');
	db.initialize();
	// Start background jobs
	streams.connectPosition();
	streams.connectAnnouncement();
	console.log('App initialized.');
};

await initializeApp();

// Handle graceful shutdown
process.on('SIGTERM', () => {
	console.log('SIGTERM received, closing streams...');
	streams.disconnectAll();
	process.exit(0);
});

process.on('SIGINT', () => {
	console.log('SIGINT received, closing streams...');
	streams.disconnectAll();
	process.exit(0);
});

// This runs on every request
export const handle: Handle = async ({ event, resolve }) => {
	// Middleware code here (optional)
	return await resolve(event);
};
