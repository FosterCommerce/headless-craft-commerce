<script>
	export default {
		name: 'BlockHeading',
		props: {
			/** The headings text */
			heading: {
				type: String,
				required: false,
				default: ''
			},
			/** The headings size */
			size: {
				type: String,
				required: false,
				default: 'medium',
				validator: (propValue) => {
					const validProps = ['small', 'medium', 'large'];
					return validProps.includes(propValue);
				}
			}
		},
		computed: {
			/** Computes the HTML heading tag to use based on the size prop */
			headingTag() {
				let tag = 'h3';
				if (this.size === 'small') {
					tag = 'h4';
				} else if (this.size === 'large') {
					tag = 'h2';
				}
				return tag;
			}
		}
	};
</script>

<template>
	<component :is="headingTag">{{ heading }}</component>
</template>
