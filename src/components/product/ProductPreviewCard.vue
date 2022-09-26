<script>
	export default {
		name: 'ProductPreviewCard',
		props: {
			product: {
				type: Object,
				required: true,
				default: () => {},
			}
		},
	};
</script>

<template>
	<div class="group relative p-4 border-r border-b border-gray-200 sm:p-6">
		<!-- Product Preview Image -->
		<div class="rounded-lg overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 group-hover:opacity-75">
			<img
				:src="product.previewImage[0].url"
				:height="product.previewImage[0].height"
				:width="product.previewImage[0].width"
				:alt="product.previewImage[0].alt"
				class="w-full h-full object-center object-cover"
			/>
		</div>

		<div class="pt-10 pb-4 text-center">
			<!-- Product Title and Link -->
			<h3 class="text-base font-medium text-gray-900">
				<nuxt-link :to="`/${product.uri}`">
					<span aria-hidden="true" class="absolute inset-0"></span>
					{{ product.title }}
				</nuxt-link>
			</h3>
			<!-- Product Preview Text -->
			<div class="mt-3 flex flex-col items-center">
				<p class="prose prose-sm text-gray-500">{{ product.previewText }}</p>
			</div>
			<!-- Product Price -->
			<p class="mt-4 text-base font-medium text-gray-900">
				${{ product.variants[0].price }}
			</p>
		</div>
	</div>
</template>
