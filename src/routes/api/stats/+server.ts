import { json } from '@sveltejs/kit';
import { getStats } from '$lib/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => json(getStats());
