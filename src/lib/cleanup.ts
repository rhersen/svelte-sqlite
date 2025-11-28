import * as db from './db';

let cleanupInterval: NodeJS.Timeout | null = null;

export function startJob(intervalMs: number = 60 * 60 * 1000): void {
	// Run cleanup every hour (3600000 ms) by default
	cleanupInterval = setInterval(() => {
		try {
			const result = db.cleanup();
			console.log(
				`Database cleanup completed: ${result.positions} positions and ${result.announcements} announcements deleted.`
			);
		} catch (error) {
			console.error('Error during database cleanup:', error);
		}
	}, intervalMs);

	console.log(`Cleanup job started with interval of ${intervalMs}ms`);
}

export function stopJob(): void {
	if (cleanupInterval) {
		clearInterval(cleanupInterval);
		cleanupInterval = null;
		console.log('Cleanup job stopped');
	}
}
