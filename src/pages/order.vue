<script>
	import { mapGetters } from "vuex";
	import Addresses from '@/queries/Addresses.gql';

	export default {
		data() {
			return {
				order: null,
				addresses: [],
				isLoading: false
			}
		},
		async fetch() {
			this.isLoading = true;

			// Get the order number from the URL param and then load the order
			const number = this.$route.query.number;
			const { order } = await this.$api.get(`/actions/fc/cart/get-order-by-number?number=${number}`);
			this.order = order;

			if (this.order) {
				// Get the addresses (billing and shipping) used in the order via their IDs
				const { data } = await this.$api.graphqlQuery(
					Addresses,
					{
						id: [order.shippingAddressId, order.billingAddressId],
						limit: 2
					}
				);
				if (data.addresses.length) {
					this.addresses = data.addresses;
				}
			}

			this.isLoading = false;
		},
		computed: {
			...mapGetters('checkout', [
				'getGateways'
			]),
			/** Gets the payment method name to display */
			paymentMethod() {
				let method = {
					id: 0,
					handle: '',
				};
				const findGateway = this.getGateways.filter((gateway) => {
					return parseInt(gateway.id) === parseInt(this.order.gatewayId);
				});
				if (findGateway.length) {
					method = findGateway[0];
				}
				return method;
			}
		}
	}
</script>

<template>
	<div>
		<div v-if="!isLoading">
			<div v-if="order" class="bg-white px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
				<div class="max-w-3xl mx-auto">
					<div class="max-w-xl">
						<h1 class="text-sm font-semibold uppercase tracking-wide text-indigo-600">Thank you!</h1>
						<p class="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{{ paymentMethod.handle === 'manual' ? "We have received your order" : "It's on the way" }}!</p>
						<p class="mt-2 text-base text-gray-500">Your order number <strong class="font-bold">{{ order.reference }}</strong> has been received.</p>

						<div v-if="paymentMethod.handle === 'manual'" class="mt-12 text-base">
							<p class="text-gray-900">Please send us your check or money order to the following address so we may continue to process the order:</p>
							<address class="mt-2 not-italic text-gray-500">
								<span class="block">Foster Clothing Inc.</span>
								<span class="block">1234 Test Street</span>
								<span class="block">Los Angeles, CA, 93277</span>
								<span class="block">US</span>
							</address>
						</div>

						<dl class="mt-12 text-sm font-medium">
							<dt class="text-gray-900">{{ paymentMethod.handle === 'manual' ? 'Your Order' : 'Your Receipt' }}</dt>
							<dd class="mt-2">
								<a :href="order.pdfUrl" :download="`Order_${order.number}`" class="text-indigo-600">Download PDF File</a>
							</dd>
						</dl>
					</div>

					<section aria-labelledby="order-heading" class="mt-10 border-t border-gray-200">
						<h2 id="order-heading" class="sr-only">Your order</h2>

						<h3 class="sr-only">Items</h3>

						<div v-for="item in order.lineItems" :key="item.id" class="py-10 border-b border-gray-200 flex space-x-6">
							<nuxt-img
								v-if="item.image.url"
								:src="item.image.url"
								:alt="item.image.alt"
								class="flex-none w-20 h-20 object-center object-cover bg-gray-100 rounded-lg sm:w-40 sm:h-40"
								loading="lazy"
							/>
							<div class="flex-auto flex flex-col">
								<div>
									<h4 class="font-medium text-gray-900">
										<nuxt-link :to="item.uri">{{ item.title }}</nuxt-link>
									</h4>
									<p v-if="item.previewText" class="mt-2 text-sm text-gray-600">{{ item.previewText }}</p>
									<div class="mt-2 flex text-sm divide-x divide-gray-200 space-x-4 sm:space-x-6">
										<p class="text-gray-500">{{ item.color.charAt(0).toUpperCase() + item.color.slice(1) }}</p>
										<p class="pl-4 text-gray-500 uppercase sm:pl-6">{{ item.size }}</p>
									</div>
								</div>
								<div class="mt-6 flex-1 flex items-end">
									<dl class="flex text-sm divide-x divide-gray-200 space-x-4 sm:space-x-6">
										<div class="flex">
											<dt class="font-medium text-gray-900">Quantity</dt>
											<dd class="ml-2 text-gray-700">{{ item.qty }}</dd>
										</div>
										<div class="pl-4 flex sm:pl-6">
											<dt class="font-medium text-gray-900">Price</dt>
											<dd class="ml-2 text-gray-700">{{ item.totalAsCurrency }}</dd>
										</div>
									</dl>
								</div>
							</div>
						</div>

						<div class="sm:ml-40 sm:pl-6">
							<h3 class="sr-only">Your information</h3>

							<h4 class="sr-only">Addresses</h4>
							<dl class="grid grid-cols-2 gap-x-6 text-sm py-10">
								<div v-for="address in addresses" :key="address.id">
									<dt class="font-medium text-gray-900">{{ address.title }}</dt>
									<dd class="mt-2 text-gray-700">
										<address class="not-italic">
											<span v-if="address.organization" class="block">{{ address.organization }} - {{ address.firstName }} {{ address.lastName }}</span>
											<span v-if="!address.organization" class="block">{{ address.firstName }} {{ address.lastName }}</span>
											<span class="block">{{ address.addressLine1 }}</span>
											<span v-if="address.addressLine2" class="block">{{ address.addressLine2 }}</span>
											<span class="block">
												{{ address.locality }},
												{{ address.administrativeArea }},
												{{ address.postalCode }}
											</span>
											<span class="block">{{ address.countryCode }}</span>
										</address>
									</dd>
								</div>
							</dl>

							<h4 class="sr-only">Payment</h4>
							<dl class="grid grid-cols-2 gap-x-6 border-t border-gray-200 text-sm py-10">
								<div>
									<dt class="font-medium text-gray-900">Payment method</dt>
									<dd class="mt-2 text-gray-700">
										<p>{{ paymentMethod.name }}</p>
									</dd>
								</div>
								<div>
									<dt class="font-medium text-gray-900">Shipping method</dt>
									<dd class="mt-2 text-gray-700">
										<p>{{ order.shippingMethodName }}</p>
									</dd>
								</div>
							</dl>

							<h3 class="sr-only">Summary</h3>

							<dl class="space-y-6 border-t border-gray-200 text-sm pt-10">
								<div class="flex justify-between">
									<dt class="font-medium text-gray-900">Subtotal</dt>
									<dd class="text-gray-700">{{ order.itemSubtotalAsCurrency }}</dd>
								</div>
								<div v-if="order.couponCode && order.totalDiscountAsCurrency !== '$0.00'" class="flex justify-between">
									<dt class="flex font-medium text-gray-900">
										Discount
										<span class="rounded-full bg-gray-200 text-xs text-gray-600 py-0.5 px-2 ml-2">{{ order.couponCode }}</span>
									</dt>
									<dd class="text-gray-700">-{{ order.totalDiscountAsCurrency }}</dd>
								</div>
								<div class="flex justify-between">
									<dt class="font-medium text-gray-900">Shipping</dt>
									<dd class="text-gray-700">{{ order.totalShippingCostAsCurrency }}</dd>
								</div>
								<div class="flex justify-between">
									<dt class="font-medium text-gray-900">Tax</dt>
									<dd class="text-gray-700">{{ order.totalTaxAsCurrency }}</dd>
								</div>
								<div class="flex justify-between">
									<dt class="font-medium text-gray-900">Total</dt>
									<dd class="text-gray-900">{{ order.totalAsCurrency }}</dd>
								</div>
							</dl>
						</div>
					</section>
				</div>
			</div>
		</div>

		<div v-else class="py-12 flex justify-center items-end">
			<BaseLoader />
		</div>
	</div>
</template>
