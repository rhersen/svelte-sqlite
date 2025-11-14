import { DatabaseSync } from 'node:sqlite';
import type { Handle } from '@sveltejs/kit';
import * as streams from '$lib/streams';

console.log('Server is starting...');

// Initialize database, load config, etc.
const initializeApp = async () => {
	console.log('Initializing app...');
	const db = new DatabaseSync('app-database.db');
	console.log('Database connected:', db.isOpen);
	// Load environment variables
	// Start background jobs
	streams.connectPosition();
	streams.connectAnnouncement();
	console.log('App initialized.');
};

await initializeApp();

// This runs on every request
export const handle: Handle = async ({ event, resolve }) => {
	// Middleware code here (optional)
	return await resolve(event);
};
