<script>
	import { mapGetters } from 'vuex';
	export default {
		computed:{
			...mapGetters({
				cartItems: 'cart/getItems',
				cart: 'cart/getCurrentCart',
				isLoading: 'cart/getLoading',
			}),
		}
	}
</script>

<template>
	<div>
		<ErrorNotices />

		<h1 class="mt-12 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Your Shopping Cart</h1>

		<div class="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">

			<!-- Cart Line Items -->
			<section v-if="!isLoading" aria-labelledby="cart-heading" class="lg:col-span-7">
				<h2 id="cart-heading" class="sr-only">Items in your shopping cart</h2>
				<ul v-if="cartItems.length > 0" role="list" class="border-t border-b border-gray-200 divide-y divide-gray-200">
					<!-- Loop through cart line items here -->
					<li v-for="item in cartItems" :key="item.id">
						<CartLineItem :item="item" />
					</li>
				</ul>
				<div v-else class="w-full py-32 flex justify-start items-center">
					<p class="text-xl text-gray-900">You currently have no items in your cart.</p>
				</div>
			</section>
			<div v-else class="h-[500px] lg:h-[600px] lg:col-span-7 animate-pulse flex justify-center items-center">
				<BaseLoader/>
			</div>

			<!-- Order summary -->
			<section v-if="!isLoading" aria-labelledby="summary-heading" class=" lg:col-span-5">
				<div v-if="cartItems.length > 0" class="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0">
					<h2 id="summary-heading" class="text-lg font-medium text-gray-900">Order summary</h2>

					<dl class="mt-6 space-y-4">
						<div class="flex items-center justify-between">
							<dt class="text-sm text-gray-600">Subtotal</dt>
							<dd class="text-sm font-medium text-gray-900">{{ cart.itemSubtotalAsCurrency }}</dd>
						</div>
						<div class="border-t border-gray-200 pt-4 flex items-center justify-between">
							<dt class="flex items-center text-sm text-gray-600">
								<span>Shipping</span>
							</dt>
							<dd class="text-sm font-medium text-gray-900">{{ cart.totalShippingCostAsCurrency }}</dd>
						</div>
						<div class="border-t border-gray-200 pt-4 flex items-center justify-between">
							<dt class="flex text-sm text-gray-600">
								<span>Tax</span>
							</dt>
							<dd class="text-sm font-medium text-gray-900">{{ cart.totalTaxAsCurrency }}</dd>
						</div>
						<div class="border-t border-gray-200 pt-4 flex items-center justify-between">
							<dt class="text-base font-medium text-gray-900">Order total</dt>
							<dd class="text-base font-medium text-gray-900">{{ cart.totalAsCurrency }}</dd>
						</div>
					</dl>

					<div class="mt-6">
						<nuxt-link to="/checkout" class="block w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base text-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">Checkout</nuxt-link>
					</div>
				</div>
			</section>

			<div v-else class="mt-16 rounded-lg h-96 lg:mt-0 lg:col-span-5">
				<div class="bg-gray-100 animate-pulse w-full h-12 rounded" />
				<div class="bg-gray-50 animate-pulse w-full h-12 rounded mt-4" />
				<div class="bg-gray-100 animate-pulse w-full h-12 rounded mt-4" />
				<div class="bg-gray-50 animate-pulse w-full h-12 rounded mt-4" />
				<div class="bg-gray-100 animate-pulse w-full h-12 rounded mt-4" />
				<div class="bg-gray-50 animate-pulse w-full h-12 rounded mt-4" />
			</div>
		</div>
	</div>
</template>
