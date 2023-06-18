<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { getAuthToken } from '$lib/auth';
	import { fetchApi } from '$lib/fetch';

	async function deleteTracking() {
		const confirmed = confirm('Are you sure you want to delete this tracking?');
		if (!confirmed) return;

		const authToken = getAuthToken();

		const res = await fetchApi(`/admin/trackings/${$page.params.id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Basic ${authToken}`
			}
		});

		if (res.status !== 204) {
			alert('Something went wrong');
		} else {
			await goto('/');
		}
	}

	async function renameTracking(e: Event) {
		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const name = formData.get('name') as string;

		const authToken = getAuthToken();

		const res = await fetchApi(`/admin/trackings/${$page.params.id}/name`, {
			method: 'PATCH',
			headers: {
				Authorization: `Basic ${authToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name })
		});

		if (res.status !== 204) {
			alert('Something went wrong');
		} else {
			form.reset();
			await invalidateAll();
		}
	}
</script>

<h1>Settings Page</h1>
<button on:click={deleteTracking}>DELETE TRACKING</button>
<form on:submit|preventDefault={renameTracking}>
	<input
		type="text"
		name="name"
		id="name"
		placeholder="Name"
		autocomplete="off"
		value={$page.data.tracking.name}
	/>
	<button type="submit">Rename Tracking</button>
</form>

<style>
	h1 {
		font-size: 1.5rem;
		font-family: 'Press Start 2P', cursive;
		margin: 1rem 0;
	}

	button {
		background-color: #ff0000;
		color: #fff;
		border: none;
		padding: 0.5rem 1rem;
		font-family: 'Press Start 2P', cursive;
		cursor: pointer;
	}

	button:hover,
	button:focus {
		background-color: #ff3333;
	}

	button:active {
		background-color: #ff6666;
		transform: scale(0.9);
	}

	form {
		width: 100%;
		max-width: 500px;
		display: grid;
		grid-template-columns: 1fr auto;
		margin-top: 0.5rem;
	}

	form input {
		background-color: transparent;
		border: 1px solid #000;
		padding: 0.5rem;
	}

	form button {
		background-color: #000;
	}

	form button:hover,
	form button:focus {
		background-color: #333;
	}

	form button:active {
		background-color: #666;
		transform: scale(0.9);
	}
</style>
