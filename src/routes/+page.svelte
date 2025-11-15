<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let stats = $derived(data.stats);
	let hasData = $derived(stats && (stats.positions > 0 || stats.announcements > 0));

	function formatDate(dateString: string | null): string {
		if (!dateString) return 'Never';
		try {
			return new Date(dateString).toLocaleString();
		} catch {
			return dateString;
		}
	}
</script>

<main>
	<h1>Train Tracking Dashboard</h1>

	{#if stats}
		<div class="stats-container">
			<div class="stat-card">
				<div class="stat-label">Total Positions</div>
				<div class="stat-value">{stats.positions}</div>
				<div class="stat-detail">Last: {formatDate(stats.lastPosition)}</div>
			</div>

			<div class="stat-card">
				<div class="stat-label">Total Announcements</div>
				<div class="stat-value">{stats.announcements}</div>
				<div class="stat-detail">Last: {formatDate(stats.lastAnnouncement)}</div>
			</div>
		</div>

		{#if !hasData}
			<div class="empty-state">
				<p>No data yet. Connect to the Trafikverket API to start collecting train data.</p>
			</div>
		{/if}

		<div class="api-docs">
			<h2>Available API Endpoints</h2>
			<ul>
				<li><code>GET /api/health</code> - Health check</li>
				<li><code>GET /api/stats</code> - Database statistics</li>
				<li>
					<code>GET /api/positions</code> - All positions (with optional <code>limit</code> query param)
				</li>
				<li>
					<code>GET /api/positions/[trainNumber]</code> - Positions for specific train (with
					optional <code>hours</code> query param)
				</li>
				<li>
					<code>GET /api/announcements</code> - All announcements (with optional <code>limit</code> query
					param)
				</li>
				<li>
					<code>GET /api/announcements/[trainIdent]</code> - Announcements for specific train (with
					optional <code>hours</code> query param)
				</li>
			</ul>
		</div>
	{:else}
		<p class="error">Failed to load statistics</p>
	{/if}
</main>

<style>
	main {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}

	h1 {
		color: #333;
		margin-bottom: 2rem;
		text-align: center;
	}

	h2 {
		color: #555;
		font-size: 1.1rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.stats-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		padding: 1.5rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.stat-label {
		font-size: 0.9rem;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.5rem;
	}

	.stat-value {
		font-size: 2.5rem;
		font-weight: bold;
		color: #0066cc;
		margin-bottom: 0.5rem;
	}

	.stat-detail {
		font-size: 0.85rem;
		color: #888;
		word-break: break-word;
	}

	.empty-state {
		text-align: center;
		padding: 2rem;
		background: #f9f9f9;
		border-radius: 8px;
		color: #666;
		margin-bottom: 2rem;
	}

	.api-docs {
		background: #f5f5f5;
		padding: 1.5rem;
		border-radius: 8px;
		border-left: 4px solid #0066cc;
	}

	.api-docs ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.api-docs li {
		padding: 0.75rem 0;
		border-bottom: 1px solid #e0e0e0;
		font-family: 'Courier New', monospace;
		font-size: 0.9rem;
	}

	.api-docs li:last-child {
		border-bottom: none;
	}

	code {
		background: #fff;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		border: 1px solid #ddd;
		font-size: 0.85em;
	}

	.error {
		color: #d32f2f;
		text-align: center;
		padding: 1rem;
	}
</style>
