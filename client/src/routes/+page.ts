import type { PageLoad } from './$types';
import { getAuthToken } from '$lib/auth';
import { TrackingsSchema } from '$lib/schema';
import { fetchApi } from '$lib/fetch';

export const load = (async () => {
	const authToken = getAuthToken();

	const res = await fetchApi('/admin/trackings', {
		headers: {
			Authorization: `Basic ${authToken}`
		}
	});
	const data = await res.json();

	return TrackingsSchema.parse(data);
}) satisfies PageLoad;
