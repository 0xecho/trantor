<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { getAuthToken } from '$lib/auth';
	import { invalidateAll } from '$app/navigation';
	import Map from '$lib/components/Map.svelte';
	import NoData from '$lib/components/NoData.svelte';
	import { fetchApi } from '$lib/fetch';

	export let data: PageData;

	const noData = data.refers.length === 0;

	async function handleAddSource(event: Event) {
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const name = formData.get('name') as string;

		const authToken = getAuthToken();

		const res = await fetchApi(`/admin/trackings/${$page.params.id}/sources`, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${authToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name })
		});

		if (res.status !== 201) {
			alert('Something went wrong');
		} else {
			form.reset();
			await invalidateAll();
		}
	}

	async function deleteSource(name: string) {
		const confirmed = confirm(`Are you sure you want to delete "${name}"?`);
		if (!confirmed) return;

		const authToken = getAuthToken();

		const res = await fetchApi(`/admin/trackings/${$page.params.id}/sources/${name}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Basic ${authToken}`
			}
		});

		if (res.status !== 204) {
			alert('Something went wrong');
		} else {
			await invalidateAll();
		}
	}

	const isoCodeToData: Record<string, number> = {};
	for (const country of data.countries) {
		isoCodeToData[country.iso_code] = country.count;
	}
	const max = data.countries[0]?.count || 0;
</script>

{#if noData}
	<NoData origin={$page.url.origin} trackingId={$page.params.id} />
{:else}
	<div class="two-columns">
		<section class="table-container">
			<h1>Sources</h1>

			<form class="add-source" on:submit|preventDefault={handleAddSource}>
				<input required name="name" placeholder="Name" type="text" autocomplete="off" />
				<button type="submit">Add Source</button>
			</form>
			<table>
				<thead>
					<th>Source Name</th>
					<th>Session Count</th>
					<th>Visitor Count</th>
					<th style="border-right: 1px solid #000;" />
				</thead>
				{#each data.sources as source}
					<tr>
						<td>{source.name}</td>
						<td>{source.session_count}</td>
						<td>{source.visitor_count}</td>
						<td>
							{#if source.name !== 'direct'}
								<button on:click={() => deleteSource(source.name)}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
											clip-rule="evenodd"
										/>
									</svg>
								</button>
							{/if}
						</td>
					</tr>
				{/each}
			</table>
			<div class="info">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
						clip-rule="evenodd"
					/>
				</svg>

				<p>
					Add <span>?src=source_name</span> to the end of yor referer URL to specify the source.
				</p>
			</div>
		</section>

		<section class="table-container">
			<h1>Paths</h1>

			<table>
				<thead>
					<th>Path</th>
					<th style="border-right: 1px solid #000;">Session Count</th>
				</thead>
				{#each data.paths as path}
					<tr>
						<td>{path.pathname}</td>
						<td>{path.count}</td>
					</tr>
				{/each}
			</table>
		</section>
	</div>

	<div class="two-columns">
		<section class="table-container">
			<h1>Pages</h1>

			<table>
				<thead>
					<th>Title</th>
					<th style="border-right: 1px solid #000;">Session Count</th>
				</thead>
				{#each data.titles as title}
					<tr>
						<td>{title.title}</td>
						<td>{title.count}</td>
					</tr>
				{/each}
			</table>
		</section>

		<section class="table-container">
			<h1>Referrers</h1>

			<table>
				<thead>
					<th>Referer</th>
					<th>Session Count</th>
					<th style="border-right: 1px solid #000;">Visitor Count</th>
				</thead>
				{#each data.refers as refer}
					<tr>
						<td>{refer.referer}</td>
						<td>{refer.session_count}</td>
						<td>{refer.visitor_count}</td>
					</tr>
				{/each}
			</table>
		</section>
	</div>

	<div class="two-columns">
		<section class="table-container">
			<h1>Countries</h1>

			<table>
				<thead>
					<th>Country</th>
					<th>ISO Code</th>
					<th style="border-right: 1px solid #000;">Session Count</th>
				</thead>
				{#each data.countries as country}
					<tr>
						<td>{country.name}</td>
						<td>{country.iso_code}</td>
						<td>{country.count}</td>
					</tr>
				{/each}
			</table>
		</section>

		<section class="table-container">
			<h1>Referrals</h1>

			<table>
				<thead>
					<th>Referral</th>
					<th style="border-right: 1px solid #000;">Session Count</th>
				</thead>
				{#each data.referrals as referral}
					<tr>
						<td>{referral.referral}</td>
						<td>{referral.count}</td>
					</tr>
				{/each}
			</table>
		</section>
	</div>

	<section class="map">
		<Map {isoCodeToData} {max} />
	</section>
{/if}

<style>
	.two-columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin-top: 1rem;
	}

	@media (max-width: 1100px) {
		.two-columns {
			grid-template-columns: 1fr;
		}
	}

	.table-container h1 {
		font-size: 1.5rem;
		font-family: 'Press Start 2P', cursive;
		margin-bottom: 1rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th,
	td {
		border: 1px solid #000;
		padding: 0.5rem;
	}

	th {
		text-align: left;
		font-size: 0.8rem;
		font-family: monospace;
		border-right: 1px solid #fff;
	}

	td,
	th {
		font-family: monospace;
	}

	thead {
		color: #fff;
		background-color: #000;
	}

	th:nth-child(2),
	th:nth-child(3),
	td:nth-child(2),
	td:nth-child(3) {
		text-align: right;
		font-weight: bolder;
	}

	th:nth-child(4),
	td:nth-child(4) {
		padding: 0;
	}

	table button {
		width: 100%;
		padding: 0.5rem;
		background-color: red;
		color: white;
		border: none;
		cursor: pointer;
	}

	table button svg {
		width: 1rem;
		height: 1rem;
	}

	table button:hover,
	table button:focus {
		background-color: #ff0000aa;
	}

	table button:active {
		transform: scale(0.9);
	}

	.add-source {
		display: grid;
		grid-template-columns: 70% 30%;
		margin-bottom: 1rem;
	}

	.add-source input {
		padding: 0.5rem;
		font-family: monospace;
		border: 1px solid #000;
		background-color: transparent;
	}

	.add-source button {
		padding: 0.5rem;
		font-family: 'Press Start 2P', cursive;
		background-color: black;
		color: white;
		border: none;
		cursor: pointer;
	}

	.add-source button:hover,
	.add-source button:focus {
		background-color: #000000aa;
	}

	.add-source button:active {
		transform: scale(0.9);
	}

	.info {
		display: flex;
		gap: 0.2rem;
		margin-top: 1rem;
		font-family: monospace;
	}

	.info svg {
		width: 1.5rem;
		height: 1.5rem;
	}

	.info span {
		padding: 0.2rem;
		color: white;
		background-color: black;
	}

	.map {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
