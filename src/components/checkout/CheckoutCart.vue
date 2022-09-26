<script>
	import { mapGetters } from 'vuex';
	export default {
		name: 'CheckoutCart',
		props: {
			isMobile: {
				type: Boolean
			}
		},
		computed: {
			...mapGetters({
				cartItems: 'cart/getItems',
			}),
			style() {
				return this.isMobile ? 'divide-y divide-gray-200 border-b border-gray-200' : 'flex-auto overflow-y-auto divide-y divide-gray-200 px-6';
			}
		},
		watch: {
			async cartItems(items) {
				if (items.length === 0) {
					await this.$router.push('/cart');
				}
			}
		},
		async mounted() {
			if (this.cartItems.length === 0) {
				await this.$router.push('/cart');
			}
		}
	};
</script>

<template>
	<ul v-if="cartItems.length > 0" role="list" :class="style">
		<li v-for="item in cartItems" :key="item.id" class="flex py-6 space-x-6">
			<CheckoutLineItem :item="item" />
		</li>
	</ul>
	<div v-else class="w-full py-12 flex justify-center items-center">
		<p class="text-base text-gray-800">You currently have no items in your cart.</p>
	</div>
</template>

