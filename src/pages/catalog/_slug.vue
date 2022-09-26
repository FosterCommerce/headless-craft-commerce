<script>
	import ProductsCatalog from '@/queries/ProductsCatalog.gql';

	export default {
		async asyncData({ $api, route }) {
			// Check for Craft Live Preview params
			let previewParams = null;
			if (route.query.token) {
				previewParams = {
					token: route.query.token,
					'x-craft-live-preview': route.query['x-craft-live-preview'],
				};
			}

			const { data } = await $api.graphqlQuery(
				ProductsCatalog,
				{
					limit: 1,
					slug: route.params.slug,
				},
				previewParams
			);

			// Break out the result of the query into product, variants,
			// and the default variant as the initially selected one
			const product = data.products[0] ?? null;
			const variants = product.variants ?? [];
			const selectedVariant = variants.find(variant => variant.isDefault === true) ?? null;

			return {
				product,
				variants,
				selectedVariant,
			}
		},
		data() {
			return {
				product: null,
				variants: [],
				selectedVariant: null,
			}
		},
		computed: {
			/** Gets the currently selected variants primary image data */
			variantImage() {
				return this.selectedVariant.image[0] ?? null
			},
			allColors() {
				return [...new Set(
					this.variants.map((variant) => {
						return variant.color;
					})
				)];
			},
			allSizes() {
				return [...new Set(
					this.variants.map((variant) => {
						return variant.size;
					})
				)];
			},
			/** Returns a relational matrix for sizes to available colors */
			sizeToColorMatrix() {
				const matrix = {};
				this.variants.forEach((sizeVariant) => {
					matrix[sizeVariant.size] = this.variants.filter((variant) => {
						return variant.size === sizeVariant.size;
					}).map(colorVariant => colorVariant.color);
				});
				return matrix;
			},
			/** Returns a relational matrix for colors to available sizes */
			colorToSizeMatrix() {
				const matrix = {};
				this.variants.forEach((colorVariant) => {
					matrix[colorVariant.color] = this.variants.filter((variant) => {
						return variant.color === colorVariant.color;
					}).map(sizeVariant => sizeVariant.size);
				});
				return matrix;
			},
			availableSizes() {
				return this.colorToSizeMatrix[this.selectedVariant.color];
			},
			availableColors() {
				return this.sizeToColorMatrix[this.selectedVariant.size];
			},
		},
		methods: {
			/** Selects the variant based on the options set (size and color) */
			selectVariant(option) {
				let colorOption = this.selectedVariant.color;
				let sizeOption = this.selectedVariant.size;

				if (option.type === 'color') {
					colorOption = option.value;
					sizeOption = this.selectedVariant.size;
				} else if (option.type === 'size') {
					colorOption = this.selectedVariant.color;
					sizeOption = option.value;
				}

				this.selectedVariant = this.variants.find(
					variant =>
						variant.color === colorOption && variant.size === sizeOption
				);
			},
		},
	};
</script>

<template>
	<div>
		<ErrorNotices />

		<div class="lg:grid lg:grid-cols-12 lg:auto-rows-min lg:gap-x-8">
			<div class="lg:col-start-8 lg:col-span-5">
				<div class="flex justify-between">
					<h1 class="text-xl font-medium text-gray-900">{{ product.title }}</h1>
					<p class="text-xl font-medium text-gray-900">{{ selectedVariant.priceAsCurrency }}</p>
				</div>
			</div>

			<!-- Image gallery -->
			<div class="mt-8 lg:mt-0 lg:col-start-1 lg:col-span-7 lg:row-start-1 lg:row-span-3">
				<h2 class="sr-only">Images</h2>
				<div class="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
					<!-- Primary Image -->
					<nuxt-img
						v-if="variantImage"
						:src="variantImage.url"
						:alt="variantImage.alt"
						class="lg:col-span-2 lg:row-span-2 rounded-lg"
						loading="lazy"
					/>

					<!-- Secondary (gallery) Images -->
					<nuxt-img
						v-for="image in selectedVariant.images"
						:key="image.id"
						:src="image.url"
						:alt="image.alt"
						class="hidden lg:block rounded-lg"
						loading="lazy"
					/>
				</div>
			</div>

			<div class="mt-8 lg:col-span-5">

				<form class="space-y-8">
					<ProductColorPicker
						:options="allColors"
						:available="availableColors"
						@option-selected="selectVariant"
					/>
					<ProductSizePicker
						:options="allSizes"
						:available="availableSizes"
						@option-selected="selectVariant"
					/>
					<ProductAddToCart
						v-if="selectedVariant.isAvailable"
						:purchasable="selectedVariant"
						qty="1"
						redirect="/cart"
					/>
				</form>

				<div class="mt-10">
					<!-- Product Content Blocks -->
					<div class="space-y-6 prose prose-sm text-gray-500">
						<ContentBlocks :blocks="product.contentBlocks" />
					</div>

					<!-- Policies (Static Text) -->
					<section aria-labelledby="policies-heading" class="mt-10">
						<h2 id="policies-heading" class="sr-only">Our Policies</h2>
						<dl class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
							<div class="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
								<dt>
									<svg class="mx-auto h-6 w-6 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span class="mt-4 text-sm font-medium text-gray-900"> International delivery </span>
								</dt>
								<dd class="mt-1 text-sm text-gray-500">Get your order in 2 years</dd>
							</div>
							<div class="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
								<dt>
									<svg class="mx-auto h-6 w-6 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span class="mt-4 text-sm font-medium text-gray-900"> Loyalty rewards </span>
								</dt>
								<dd class="mt-1 text-sm text-gray-500">Don&#039;t look at other tees</dd>
							</div>
						</dl>
					</section>
				</div>
			</div>
		</div>
	</div>
</template>
