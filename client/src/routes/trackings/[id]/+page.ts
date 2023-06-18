import type { PageLoad } from './$types';
import { getAuthToken } from '$lib/auth';
import { TrackingCounts } from '$lib/schema';
import { customFetchApi } from '$lib/fetch';

export const load = (async ({ params, fetch }) => {
	const authToken = getAuthToken();
	const fetchApi = customFetchApi(fetch);

	const res = await fetchApi(`/admin/trackings/${params.id}/counts`, {
		headers: {
			Authorization: `Basic ${authToken}`
		}
	});
	const sourcesData = await res.json();

	return TrackingCounts.parse(sourcesData);
}) satisfies PageLoad;
