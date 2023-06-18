<script lang="ts">
	import { formatRelative } from 'date-fns';

	import type { PageData } from './$types';
	import { getAuthToken } from '$lib/auth';
	import { invalidateAll } from '$app/navigation';
	import { pluralized } from '$lib/utils';
	import { fetchApi } from '$lib/fetch';

	export let data: PageData;

	async function handleCreateTracking(event: Event) {
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const name = formData.get('name')! as string;

		const authToken = getAuthToken();

		const res = await fetchApi('/admin/trackings', {
			method: 'POST',
			headers: {
				Authorization: `Basic ${authToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name })
		});

		if (!res.ok) {
			alert('Something went wrong');
		}

		form.reset();
		await invalidateAll();
	}

	const now = new Date();
</script>

<svelte:head>
	<title>Dashboard | Trantor</title>
</svelte:head>

<h1 class="title">Trackings</h1>

<section>
	<div class="trackings-grid">
		<div class="card form-card">
			<form on:submit|preventDefault={handleCreateTracking}>
				<input required name="name" type="text" placeholder="Name" autocomplete="off" />
				<button type="submit">Create Tracking</button>
			</form>
		</div>

		{#each data.trackings as tracking}
			<a href={`/trackings/${tracking.id}`} class="card">
				<h1>{tracking.name}</h1>
				<time>{formatRelative(tracking.created_at, now)}</time>

				<div class="stats">
					<div>
						<span class="number">{tracking.visitor_count}</span>
						<span>{pluralized(tracking.visitor_count, 'visitor', 'visitors')}</span>
					</div>

					<div>
						<span class="number">{tracking.sessions_count}</span>
						<span>{pluralized(tracking.sessions_count, 'session', 'sessions')}</span>
					</div>

					<div>
						<span class="number">{tracking.events_count}</span>
						<span>{pluralized(tracking.events_count, 'event', 'events')}</span>
					</div>

					<div>
						<span class="number">{tracking.sources_count}</span>
						<span>{pluralized(tracking.sources_count, 'source', 'sources')}</span>
					</div>
				</div>
			</a>
		{/each}
	</div>
</section>

<style>
	time {
		font-family: monospace;
		text-transform: lowercase;
	}

	a {
		text-decoration: none;
		color: inherit;
		transition: all 0.2s ease-in-out;
	}

	a:hover,
	a:focus {
		color: white;
		background-color: black;
	}

	a:active {
		transform: scale(0.9);
	}

	.title {
		padding: 2rem;
		font-family: 'Press Start 2P', cursive;
	}

	.trackings-grid {
		padding: 0 2rem;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	@media (max-width: 1300px) {
		.trackings-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 850px) {
		.trackings-grid {
			grid-template-columns: 1fr;
		}
	}

	.card {
		width: 100%;
		padding: 1rem;
		border: 1px solid #ccc;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		box-shadow: 5px 6px rgba(0, 0, 0, 0.5);
	}

	.card h1 {
		font-size: 1.5rem;
		font-family: 'Press Start 2P', cursive;
		margin-bottom: 1rem;
		text-align: center;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		font-family: monospace;
	}

	.stats div {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.number {
		font-family: 'Press Start 2P', cursive;
		margin-bottom: 0.5rem;
	}

	.form-card {
		background-color: black;
	}

	form {
		width: 100%;
	}

	form input {
		color: white;
		border: none;
		padding: 0.8rem;
		width: 100%;
		background-color: transparent;
		border: 1px solid #ccc;
		margin-bottom: 0.5rem;
		font-family: monospace;
	}

	form input::placeholder {
		color: #ccc;
	}

	form button {
		font-family: 'Press Start 2P', cursive;
		padding: 0.8rem;
		width: 100%;
		border: none;
		background-color: white;
		cursor: pointer;
	}

	form button:hover,
	form button:focus {
		background-color: #aaa;
	}

	form button:active {
		transform: scale(0.9);
	}
</style>
