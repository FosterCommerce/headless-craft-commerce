<script>
	export default {
		name: 'BlockButton',
		props: {
			/** The Link Type field data from Craft (as an object) */
			buttonLink: {
				type: Object,
				required: false,
				default: () => ({})
			}
		},
		computed: {
			/** Determine if this is an internal or external URL */
			isInternal() {
				return this.buttonLink?.type === 'entry';
			},
			/** Resolves the URL/URI to include the link for */
			url() {
				let url = '/';
				if (this.buttonLink?.type === 'entry') {
					url = this.buttonLink.element.uri
				} else if (this.buttonLink?.type === 'url') {
					url = this.buttonLink.url;
				}
				return url;
			},
			/** Resolves the link target attribute */
			target() {
				let target = '_self';
				if (this.buttonLink?.target !== '' && this.buttonLink?.target !== null) {
					target = this.buttonLink.target
				}
				return target;
			},
			/** Resolves the button label */
			label() {
				let label = 'Learn More';
				if (this.buttonLink?.customText !== null) {
					label = this.buttonLink.customText;
				} else if (this.buttonLink?.type === 'entry') {
					label = this.buttonLink?.element?.title;
				}
				return label;
			},
			/** The button styling (static) */
			styles() {
				return 'bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex items-center justify-center text-base font-medium text-white no-underline hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
			}
		}
	}
</script>

<template>
	<div class="my-6 buttonBlock">
		<nuxt-link v-if="isInternal" :to="url" :target="target" :class="styles">{{ label }}</nuxt-link>
		<a v-else :href="url" :target="target" :class="styles">{{ label }}</a>
	</div>
</template>

<style lang="postcss" scoped>
	.buttonBlock:last-child {
		margin-bottom: 0;
	}
</style>
