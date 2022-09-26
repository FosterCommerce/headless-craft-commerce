<script>
	export default {
		name: 'BlockCopy',
		props: {
			/** The rich text HTML string to render */
			richText: {
				type: String,
				required: false,
				default: ''
			}
		}
	};
</script>

<template>
	<div v-html="richText" />
</template>
