<script>
	import { mapGetters } from "vuex";

	export default {
		name: 'ErrorNotices',
		computed: {
			...mapGetters({
				cartErrors: 'cart/getCartErrors'
			}),
			errors() {
				return this.cartErrors;
			}
		}
	};
</script>

<template>
	<transition
		enter-active-class="transform transition ease-in-out duration-300"
		enter-class="translate-x-full"
		enter-to-class="translate-x-0"
		leave-active-class="transform transition ease-in-out duration-300"
		leave-from-class="translate-x-0"
		leave-to-class="translate-x-full"
	>
		<div v-if="errors.length > 0" class="fixed w-full top-0 right-0 bg-white py-2 px-4 z-50 max-w-md space-y-3">
			<div v-for="(error, i) in errors" :key="i" class="px-2 py-2 text-sm rounded bg-red-500 text-white">{{ error }}</div>
		</div>
	</transition>
</template>
