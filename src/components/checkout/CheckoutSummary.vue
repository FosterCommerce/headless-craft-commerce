<script>
	import { mapGetters } from 'vuex';
	export default {
		name: 'CheckoutSummary',
		props: {
			isMobile: {
				type: Boolean
			}
		},
		computed:{
			...mapGetters({
				cartItems: 'cart/getItems',
				cart: 'cart/getCurrentCart',
			}),
		}
	};
</script>


<template>
	<dl class="text-sm font-medium text-gray-500 mt-10 space-y-6">
		<div class="flex justify-between">
			<dt>Subtotal</dt>
			<dd class="text-gray-900">{{ cart.itemSubtotalAsCurrency }}</dd>
		</div>
		<div v-if="cart.couponCode && cart.totalDiscountAsCurrency !== '$0.00'" class="flex justify-between">
			<dt class="flex">
				Discount
				<span class="ml-2 rounded-full bg-gray-200 text-xs text-gray-600 py-0.5 px-2 tracking-wide uppercase">{{ cart.couponCode }}</span>
			</dt>
			<dd class="text-gray-900">{{ cart.totalDiscountAsCurrency }}</dd>
		</div>
		<div class="flex justify-between">
			<dt>Taxes</dt>
			<dd class="text-gray-900">{{ cart.totalTaxAsCurrency }}</dd>
		</div>
		<div class="flex justify-between">
			<dt>Shipping</dt>
			<dd class="text-gray-900">{{ cart.totalShippingCostAsCurrency }}</dd>
		</div>
		<div v-if="!isMobile" class="flex items-center justify-between border-t border-gray-200 text-gray-900 pt-6">
			<dt class="text-base">Total</dt>
			<dd class="text-base">{{ cart.totalAsCurrency }}</dd>
		</div>
	</dl>
</template>
