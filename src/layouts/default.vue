<script>
	import SEOMaticQuery from '@/queries/SEOMatic.gql';

	export default {
		fetchOnServer: false,
		data() {
			return {
				metaTags: null,
				title: null,
			};
		},
		async fetch() {
			// Set the user data
			await this.$store.dispatch('user/fetchSessionData');
			// Populate and sync the cart
			await this.$store.dispatch('cart/fetchCart');
		},
		/** Sets the meta-data in the head */
		head() {
			const tags = [];
			const result = {
				title: this.title,
			};

			if (this.metaTags) {
				const meta = Object.entries(this.metaTags);
				const fullPath = this.$route.fullPath;
				const path = fullPath.replace(/^\//g, '').replace(/\/$/g, '');
				const pathArr = path.split('/');
				let hid = '';

				for (let i = 0; i < pathArr.length; i++) {
					hid += i ? this.ucfirst(pathArr[i]) : pathArr[i];
				}

				for (const tag of meta) {
					const data = tag[1];

					if (data?.content && data?.content.length) {
						data.hid = hid;

						if (data.name) {
							data.hid += this.ucfirst(data.name);
						} else if (data.property) {
							const props = data.property.split(':');

							for (const prop of props) {
								data.hid += this.ucfirst(prop);
							}
						}

						tags.push(data);
					}
				}
			}

			result.meta = [...tags];

			return result;
		},
		computed: {
			/** Checks the route for the checkout page (to swap site headers) */
			isCheckout() {
				return this.$route.path === '/checkout';
			},
		},
		watch: {
			$route(to) {
				this.seoData(to.fullPath);
			},
		},
		mounted() {
			this.seoData(this.$route.fullPath);
		},
		methods: {
			async seoData(uri) {
				const seoData = await this.$api.graphqlQuery(SEOMaticQuery, { uri });

				if (seoData?.data?.seomatic) {
					const data = seoData.data.seomatic;

					if (data?.metaTitleContainer) {
						const titleContainer = JSON.parse(data?.metaTitleContainer);

						this.title = titleContainer.title?.title;
					}

					if (data?.metaTagContainer) {
						this.metaTags = JSON.parse(data.metaTagContainer);
					}
				}
			},
			ucfirst(str) {
				return str[0].toUpperCase() + str.slice(1).toLowerCase();
			},
		},
	};
</script>

<template>
  <div class="bg-white">
		<!-- Display the checkout header or the site header -->
    <CheckoutHeader v-if="isCheckout" />
		<TheHeader v-else />

		<!-- Main content area -->
    <main class="mt-8 max-w-2xl mx-auto pb-16 px-4 sm:pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <Nuxt />
    </main>

		<!-- Site footer -->
    <TheFooter />
  </div>
</template>
