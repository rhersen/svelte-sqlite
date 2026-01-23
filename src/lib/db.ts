import { DatabaseSync } from 'node:sqlite';
import type { PositionRecord, DatabaseStats } from './types.ts';

const db = new DatabaseSync('app-database.db');

export function initialize(): void {
	db.exec(`
    CREATE TABLE IF NOT EXISTS positions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      operational_train_number TEXT NOT NULL,
      operational_train_departure_date TEXT NOT NULL,
      journey_plan_number TEXT,
      journey_plan_departure_date TEXT,
      advertised_train_number TEXT,
      latitude REAL,
      longitude REAL,
      sweref99tm_x REAL,
      sweref99tm_y REAL,
      timestamp TEXT NOT NULL,
      bearing REAL,
      speed REAL,
      created_at INTEGER NOT NULL
    )
  `);

	db.exec(`
    CREATE INDEX IF NOT EXISTS idx_positions_train
    ON positions(operational_train_number, created_at DESC)
  `);

	db.exec(`
    CREATE INDEX IF NOT EXISTS idx_positions_date
    ON positions(created_at DESC)
  `);
}

function parseWktPoint(wkt: string): { x: number; y: number } | null {
	if (!wkt) return null;
	const match = wkt.match(/POINT\s*\(\s*([\d.-]+)\s+([\d.-]+)\s*\)/);
	return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : null;
}

export function savePosition(position: PositionRecord): void {
	const wgs84 = parseWktPoint(position.Position.WGS84 || '');
	const sweref = parseWktPoint(position.Position.SWEREF99TM || '');
	const now = Date.now();

	db.prepare(
		`
    INSERT INTO positions (
      operational_train_number,
      operational_train_departure_date,
      journey_plan_number,
      journey_plan_departure_date,
      advertised_train_number,
      latitude,
      longitude,
      sweref99tm_x,
      sweref99tm_y,
      timestamp,
      bearing,
      speed,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
	).run(
		position.Train.OperationalTrainNumber,
		position.Train.OperationalTrainDepartureDate.substring(0, 10),
		position.Train.JourneyPlanNumber || null,
		position.Train.JourneyPlanDepartureDate || null,
		position.Train.AdvertisedTrainNumber || null,
		wgs84?.y || null, // latitude
		wgs84?.x || null, // longitude
		sweref?.x || null,
		sweref?.y || null,
		position.TimeStamp,
		position.Bearing || null,
		position.Speed || null,
		now
	);
}

export function getPositionsByTrainNumber(
	trainNumber: string,
	date: string
): Record<string, unknown>[] {
	return db
		.prepare(
			`
      SELECT * FROM positions
      WHERE operational_train_number = ? AND operational_train_departure_date = ?
      ORDER BY created_at DESC
    `
		)
		.all(trainNumber, date) as Record<string, unknown>[];
}

export function getPositionsBySpeed(minSpeed: number = 0): Record<string, unknown>[] {
	return db
		.prepare('SELECT * FROM positions WHERE speed >= ? ORDER BY created_at DESC')
		.all(minSpeed) as Record<string, unknown>[];
}

export function cleanup(hoursToKeep: number = 50): number {
	const cutoff = Date.now() - hoursToKeep * 60 * 60 * 1000;

	const posChanges = db.prepare(`DELETE FROM positions WHERE created_at < ?`).run(cutoff);

	return typeof posChanges === 'number' ? posChanges : 0;
}

export function getStats(): DatabaseStats {
	const pos = (
		db.prepare(`SELECT COUNT(*) as count FROM positions`).get() as {
			count: number;
		}
	).count;
	const lastPos = db.prepare(`SELECT MAX(timestamp) as timestamp FROM positions`).get() as
		| { timestamp: string }
		| undefined;
	return {
		positions: pos,
		lastPosition: lastPos?.timestamp
	};
}
