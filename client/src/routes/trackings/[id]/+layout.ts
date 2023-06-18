import type { LayoutLoad } from './$types';
import { getAuthToken } from '$lib/auth';
import { TrackingDataSchema } from '$lib/schema';
import { customFetchApi } from '$lib/fetch';

export const load = (async ({ params, fetch }) => {
	const authToken = getAuthToken();
	const fetchApi = customFetchApi(fetch);

	const trackingRes = await fetchApi(`/admin/trackings/${params.id}`, {
		headers: {
			Authorization: `Basic ${authToken}`
		}
	});
	const trackingData = await trackingRes.json();
	const tracking = TrackingDataSchema.parse(trackingData);

	return {
		tracking
	};
}) satisfies LayoutLoad;
