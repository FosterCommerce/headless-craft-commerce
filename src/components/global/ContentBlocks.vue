<script>
	import BlockHeading from '@/components/blocks/BlockHeading';
	import BlockCopy from '@/components/blocks/BlockCopy';
	import BlockImage from '@/components/blocks/BlockImage';
	import BlockButton from '@/components/blocks/BlockButton';

	export default {
		name: 'ContentBlocks',
		components: {
			BlockHeading,
			BlockCopy,
			BlockImage,
			BlockButton
		},
		props: {
			/** The content builder field blocks in an array */
			blocks: {
				type: Array,
				required: false,
				default: () => ([])
			}
		},
		methods: {
			/**
			 * Method to resolve content builder block types to their corresponding Vue block component
			 * Ex. "BlockHeading", "BlockCopy", etc ...
			 * */
			blockName(handle) {
				return 'Block' + handle.charAt(0).toUpperCase() + handle.slice(1);
			}
		}
	};
</script>

<template>
	<div>
		<component
			:is="blockName(block.type)"
			v-for="block in blocks"
			:key="block.id"
			v-bind="block"
		/>
	</div>
</template>
