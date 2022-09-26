<script>
	import ProductsCatalog from '@/queries/ProductsCatalog.gql';
	import ProductsCount from '@/queries/ProductsCount.gql';

	export default {
		name: 'PagesCollection',
		props: {
			entry: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				page: 1,
				numPages: 1,
				products: [],
			};
		},
		async fetch() {
			const categories = this.categories;
			const limit = parseInt(this.entry.pagination);
			const numProducts = await this.$api.graphqlQuery(ProductsCount, { categories });
			let count = 1;

			if (numProducts) {
				count = parseInt(numProducts.data?.count);
			}

			this.numPages = Math.ceil(count / limit);

			await this.fetchProducts();
		},
		computed: {
			categories() {
				let categories = [];

				for (const category of this.entry.categories) {
					categories.push(parseInt(category.id));
				}

				if (!categories.length) {
					categories = null;
				}

				return categories;
			},
		},
		watch: {
			async page() {
				await this.fetchProducts();
			}
		},
		methods: {
			async fetchProducts() {
				const limit = parseInt(this.entry.pagination);
				const offset = (this.page - 1) * limit;
				const categories = this.categories;

				const products = await this.$api.graphqlQuery(
					ProductsCatalog,
					{ categories, limit, offset, orderBy: "dateCreated DESC" }
				);

				this.products = products?.data?.products;
			},
			setPage(page) {
				if (page > 0 && page <= this.numPages) {
					this.page = page;
				}
			},
		},
	};
</script>

<template>
	<div>
		<!-- Collection Header -->
		<header class="text-center py-16 px-4 sm:px-6 lg:px-8">
			<h1 class="text-4xl font-extrabold tracking-tight text-gray-900">{{ entry.title }}</h1>
			<p class="mt-4 max-w-xl mx-auto text-base text-gray-500">The secret to a tidy desk? Don't get rid of anything, just put it in really really nice looking containers.</p>
		</header>

		<!-- Collection Product grid -->
		<section aria-labelledby="products-heading" class="max-w-7xl mx-auto overflow-hidden sm:px-6 lg:px-8">
			<h2 id="products-heading" class="sr-only">Products</h2>
			<div class="-mx-px border-l border-t border-gray-200 grid grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
				<ProductPreviewCard v-for="product of products" :key="product.id" :product="product" />
			</div>
		</section>

		<!-- Collection Pagination -->
		<Pagination
			:num-pages="numPages"
			:page="page"
			@set-page="setPage"
		/>
	</div>
</template>
