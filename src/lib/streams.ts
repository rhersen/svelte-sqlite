import { EventSource } from 'eventsource';
import { savePosition } from './db.ts';
import { buildPositionQuery, fetchTrafikverket } from './trafikverket.ts';
import type { TrafikverketResultItem } from './types.ts';

// Configuration
const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 60000; // 1 minute

// Track active connections
let positionStream: EventSource | null = null;
let positionReconnectAttempts = 0;

// Helper function for exponential backoff
function getRetryDelay(attempt: number): number {
	const delay = Math.min(INITIAL_RETRY_DELAY * Math.pow(2, attempt), MAX_RETRY_DELAY);
	// Add jitter to prevent thundering herd
	return delay + Math.random() * 1000;
}

export async function connectPosition(): Promise<void> {
	// Clean up existing connection
	if (positionStream) {
		positionStream.close();
		positionStream = null;
	}

	try {
		console.info('🚂 Connecting to Trafikverket TrainPosition stream...');
		const result = await fetchTrafikverket(buildPositionQuery());
		const sseUrl = result.RESPONSE.RESULT[0].INFO.SSEURL;

		if (!sseUrl) {
			throw new Error('No SSE URL returned from Trafikverket');
		}

		positionStream = new EventSource(sseUrl);
		console.info('✅ Position stream connected');

		positionStream.onopen = () => {
			console.info('✅ Position stream opened successfully');
			positionReconnectAttempts = 0; // Reset on successful connection
		};

		positionStream.onmessage = (event: MessageEvent) => {
			try {
				JSON.parse(event.data).RESPONSE.RESULT.forEach(
					({ TrainPosition = [] }: TrafikverketResultItem) => {
						console.info(`${TrainPosition.length} positions`);
						TrainPosition.forEach(savePosition);
					}
				);
			} catch (error) {
				console.error('Error processing position message:', error);
			}
		};

		positionStream.onerror = (error: Event) => {
			console.error('❌ Position stream error:', error);

			// Close the failed connection
			if (positionStream) {
				positionStream.close();
				positionStream = null;
			}

			// Attempt reconnection with exponential backoff
			if (positionReconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
				const delay = getRetryDelay(positionReconnectAttempts);
				positionReconnectAttempts++;

				console.warn(
					`⚠️ Reconnecting position stream in ${Math.round(delay / 1000)}s (attempt ${positionReconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`
				);

				setTimeout(() => {
					connectPosition();
				}, delay);
			} else {
				console.error(
					`❌ Position stream failed after ${MAX_RECONNECT_ATTEMPTS} attempts. Manual restart required.`
				);
			}
		};
	} catch (error) {
		console.error('❌ Position stream connection error:', error);

		// Attempt reconnection for initial connection failures too
		if (positionReconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
			const delay = getRetryDelay(positionReconnectAttempts);
			positionReconnectAttempts++;

			console.warn(
				`⚠️ Retrying position stream connection in ${Math.round(delay / 1000)}s (attempt ${positionReconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`
			);

			setTimeout(() => {
				connectPosition();
			}, delay);
		}
	}
}

// Cleanup function for graceful shutdown
export function disconnectAll(): void {
	console.info('🔌 Disconnecting all streams...');

	if (positionStream) {
		positionStream.close();
		positionStream = null;
	}

	positionReconnectAttempts = 0;

	console.info('✅ All streams disconnected');
}

// Health check function
export function getStreamStatus(): {
	position: boolean;
} {
	return {
		position: positionStream?.readyState === EventSource.OPEN
	};
}
