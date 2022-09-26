<script>
	/** This component acts as a controller to get the appropriate views component
	 * to render the page entry type. */

	import PagesGeneral from '@/components/views/PagesGeneral';
	import PagesCollection from '@/components/views/PagesCollection';
	import EntriesPages from '@/queries/EntriesPages.gql';

	export default {
		components: {
			PagesGeneral,
			PagesCollection
		},
		async asyncData({ $api, route }) {
			// Check for Craft Live Preview params
			let previewParams = null;
			let allowDraft = false;
			if (route.query.token) {
				allowDraft = true;
				previewParams = {
					token: route.query.token,
					'x-craft-live-preview': route.query['x-craft-live-preview'],
				};
			}

			// Call the query API method to get the data from Craft
			const {data: queryData} = await $api.graphqlQuery(
				EntriesPages,
				{
					limit: 1,
					uri: route.params.pathMatch,
					allowDraft
				},
				previewParams
			);

			return {
				entry: queryData?.entries[0],
			};
		},
		data() {
			return {
				entry: null,
			};
		},
		computed: {
			/** Calculates the page view component to call based on the Craft section handle and entry type handle
			 * of the entry we have fetched */
			pageViewComponent() {
				const section = this.entry?.sectionHandle.charAt(0).toUpperCase() + this.entry?.sectionHandle.slice(1);
				const type = this.entry?.typeHandle.charAt(0).toUpperCase() + this.entry?.typeHandle.slice(1);

				return section + type;
			},
		}
	}
</script>

<template>
	<div>
		<component v-if="entry" :is="pageViewComponent" :entry="entry" />
	</div>
</template>
