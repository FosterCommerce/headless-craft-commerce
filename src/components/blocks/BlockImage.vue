<script>
	export default {
		name: 'BlockImage',
		props: {
			/** The image data from Craft (as an object or an array of objects) */
			image: {
				type: [Object, Array],
				required: false,
				default: () => ([])
			},
		},
		computed: {
			/** Determines the source (URL) of the image from the data we get from Craft */
			imageSource() {
				let source = '';
				if (this.image.length) {
					source = this.image[0]?.url;
				} else if (typeof this.image === 'object' && 'url' in this.image) {
					source = this.image.url;
				}
				return source;
			},
			/** Determines the alternative text (alt) of the image from the data we get from Craft */
			altText() {
				let text = '';
				if (this.image.length) {
					text = this.image[0]?.alt;
				} else if (typeof this.image === 'object' && 'alt' in this.image) {
					text = this.image.alt;
				}
				return text;
			}
		}
	};
</script>

<template>
	<figure>
		<nuxt-img
			:src="imageSource"
			:alt="altText"
			class="w-full rounded-lg"
			loading="lazy"
		/>
	</figure>
</template>
