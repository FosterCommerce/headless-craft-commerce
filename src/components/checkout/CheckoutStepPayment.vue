<script>
	import { mapGetters, mapActions } from 'vuex';
	import { loadStripe } from '@stripe/stripe-js';

	export default {
		name: 'CheckoutStepPayment',
		data() {
			return {
				stripe: {},
				card: {},
				billingSameAsShipping: false,
				newAddress: {
					id: '',
					title: 'Billing Address',
					fullName: '',
					organization: '',
					addressLine1: '',
					addressLine2: '',
					locality: '',
					administrativeArea: '',
					countryCode: '',
					postalCode: '',
					phone: '',
				},
				paypalForm: null,
				paypalLoaded: false,
				transactionHash: null,
				paymentGateway: 'stripe',
				isSaving: false,
				cardError: null,
				paypalError: null,
				manualError: null,
			};
		},
		computed: {
			...mapGetters('cart', [
				'getBillingAddress',
				'getBillingSameAsShipping',
				'getCurrentCart',
				'getCartErrors'
			]),

			...mapGetters('checkout', [
				'getIsFirstStep',
				'getPreviousStep',
				'getGateways'
			]),

			gatewayId() {
				const gateway = this.getGateways.filter((gateway) => gateway.handle === this.paymentGateway);

				return gateway[0].id;
			},
		},
		watch: {
			billingSameAsShipping() {
				this.saveBillingSameAsShipping(this.billingSameAsShipping);
			},

			async paymentGateway() {
				await this.updateCartGateway();

				if (this.paymentGateway === 'paypal' && !this.paypalLoaded) {
					const cart = this.getCurrentCart;
					const clientId = process.env.ppClientId;

					this.loadScriptAsync(`https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${cart.currency}&intent=capture`, () => {
						const paypal = typeof window.paypal !== "undefined" ? window.paypal : null;

						if (paypal) {
							const gateway = this.getGateways.filter((gateway) => gateway.handle === 'paypal');
							const paypalButtonsComponent = paypal.Buttons({
								fundingSource: paypal.FUNDING.PAYPAL,

								style: {
									shape: 'rect',
									height: 40,
								},

								// set up the transaction
								createOrder: () => {
									return this.$api.postAction('/commerce/payments/pay', {
										redirect: gateway[0].redirect,
										cancelUrl: gateway[0].cancelUrl,
									}).then((res) => {
										return res;
									}).then((data) => {
										this.transactionHash = data.transactionHash;
										return data.transactionId;
									});
								},

								// Finalize the transaction.
								onApprove: async () => {
									await this.saveBilling();

									const completed = await this.$api.get(
										`/actions/commerce/payments/complete-payment?commerceTransactionHash=${this.transactionHash}`
									);

									await this.$router.push(completed.url);
									this.goToFirstStep();
								},

								// handle unrecoverable errors
								onError: () => {
									this.paypalError = 'An error has occurred while processing the payment.';
								},
							});

							if (paypalButtonsComponent.isEligible()) {
								paypalButtonsComponent
									.render('#paypal-button-container')
									.catch((err) => {
										console.error('PayPal Buttons failed to render', err);
									});
							} else {
								this.paypalError = 'The funding source is ineligible';
							}

							this.paypalLoaded = true;
						}
					});
				}
			},
		},
		async mounted() {
			await this.updateCartGateway();
			this.billingSameAsShipping = this.getBillingSameAsShipping;
			this.stripe = await loadStripe(process.env.stripePublicKey);
			const elements = this.stripe.elements();
			this.card = elements.create('card');
			this.card.mount('#card-element');

			this.card.on('change', () => {
				this.cardError = null;
			});

			const payPalGateway = this.getGateways.filter((gateway) => gateway.handle === 'paypal');

			if (payPalGateway && payPalGateway.length) {
				const ppGatewayId = payPalGateway[0].id;
				this.paypalForm = await this.$api.get(`/actions/fc/payments/get-form-html?id=${ppGatewayId}`);
			}
		},
		methods: {
			...mapActions('cart', [
				'saveBillingSameAsShipping',
				'saveBillingAddress'
			]),

			...mapActions('checkout', [
				'decrementStep',
				'incrementStep',
				'goToFirstStep',
			]),

			async saveBilling() {
				if (this.billingSameAsShipping) {
					await this.saveBillingSameAsShipping(true);
				} else {
					await this.saveBillingAddress(this.newAddress);
				}
			},

			async processStripePayment() {
				this.isSaving = true;

				const paymentData = {
					billing_details: {
						email: this.getCurrentCart.customer.email,
					}
				};

				await this.saveBilling();

				if (this.getCartErrors.length === 0) {
					this.stripe.createPaymentMethod('card', this.card, paymentData)
						.then(async (result) => {
							if (result.error) {
								// Show the user any errors
								this.cardError = result.error.message;
							} else {

								const response = await this.$api.postAction('/commerce/payments/pay', {
									'paymentForm[stripe][paymentMethodId]': result.paymentMethod.id
								});

								if (response.message) {
									this.cardError = response.message;
								} else {
									await this.$router.push(`/order?number=${this.getCurrentCart.number}`);
									this.goToFirstStep();
								}

								this.isSaving = false;
							}
						});
				}
			},

			async processManualPayment() {
				await this.saveBilling();

				const response = await this.$api.postAction('/commerce/payments/pay')

				if (response.message) {
					this.manualError = response.message;
				} else {
					// TODO Handle success
					console.log('Order Done', response);
					await this.$router.push(`/order?number=${this.getCurrentCart.number}`);
					this.goToFirstStep();
				}
			},

			nextStep() {
				if (this.paymentGateway === 'stripe') {
					this.processStripePayment();
				} else if (this.paymentGateway === 'paypal') {
					this.processPaypalPayment();
				} else {
					this.processManualPayment();
				}
			},

			previousStep() {
				// ... Any code that needs to happen here before
				// stepping back in the process
				this.decrementStep();
			},

			loadScriptAsync(url, callback) {
				const script = document.createElement('script');

				script.setAttribute('src', url);
				script.onload = callback;
				document.head.insertBefore(script, document.head.firstElementChild);
			},

			async updateCartGateway() {
				await this.$api.postAction('/fc/cart/update-cart', {
					gatewayId: this.gatewayId
				});
			},
		},
	};
</script>

<template>
	<div>
		<section aria-labelledby="payment-heading">
			<div class="space-y-2 sm:flex sm:justify-between sm:items-center sm:space-y-0">
				<h2 id="payment-heading" class="text-xl font-medium text-gray-900 lg:text-2xl">
					Payment details
				</h2>

				<p class="flex justify-start text-sm text-gray-500">
					<svg class="w-4 h-4 text-gray-400 mr-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
					</svg>
					<span>Shopping is always safe and secure.</span>
				</p>
			</div>

			<div class="text-sm text-gray-500">Select a payment method</div>

			<div class="mt-6">
				<div class="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
					<div v-for="gateway in getGateways" :key="gateway.handle" class="flex items-center">
						<input
							:id="`gateway_${gateway.handle}`"
							v-model="paymentGateway"
							name="gateway"
							type="radio"
							:value="gateway.handle"
							class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label :for="`gateway_${gateway.handle}`" class="ml-3 block text-sm font-medium text-gray-700">{{ gateway.name }}</label>
					</div>
				</div>
			</div>

			<div class="mt-6">

				<div v-show="paymentGateway === 'stripe'">
					<div class="flex flex-col justify-center items-stretch w-full h-10 px-4 border border-gray-300 rounded-md">
						<div id="card-element" />
					</div>
          <div v-if="cardError" class="text-red-500 text-sm mt-2">{{ cardError }}</div>
				</div>

				<div v-show="paymentGateway === 'paypal'">
					<div class="w-full px-4 py-2 border border-gray-300 rounded-md">
						<div>PayPal text here.</div>

						<div v-if="paypalError" class="text-red-500 text-sm mt-2">{{ paypalError }}</div>
					</div>
				</div>

				<div v-show="paymentGateway === 'manual'">
					<div class="w-full px-4 py-2 border border-gray-300 rounded-md">
						<div>
							<p class="text-gray-900">
								Please send us your check or money order to the following address so we may continue to process the order:
							</p>
							<address class="mt-2 not-italic text-gray-500">
								<span class="block">Foster Clothing Inc.</span>
								<span class="block">1234 Test Street</span>
								<span class="block">Los Angeles, CA, 93277</span>
								<span class="block">US</span>
							</address>
						</div>
						<div v-if="manualError" class="text-red-500 text-sm mt-2">{{ manualError }}</div>
					</div>
				</div>

			</div>

		</section>

		<section v-show="paymentGateway !== 'paypal'" aria-labelledby="billing-heading" class="mt-10">
			<h2 id="billing-heading" class="text-xl font-medium text-gray-900 lg:text-2xl">
				Billing address
			</h2>
			<p class="text-sm text-gray-500">
				Same as your shipping address or include a separate billing address.
			</p>

			<div class="mt-6 flex items-center">
				<input
					id="same-as-shipping"
          v-model="billingSameAsShipping"
					name="same-as-shipping"
					type="checkbox"
					class="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
				>
				<div class="ml-2">
					<label for="same-as-shipping" class="text-sm font-medium text-gray-900">
						Same as shipping address
					</label>
				</div>
			</div>

			<div v-if="!billingSameAsShipping">
        <CheckoutAddressFields v-model="newAddress" context="billing" :use-full-name="true" />
			</div>
		</section>

		<div
			class="flex flex-col justify-start items-stretch gap-y-4 pt-8 sm:flex-row-reverse sm:justify-between sm:items-center lg:pt-16"
		>
			<button
				v-if="paymentGateway !== 'paypal'"
				:class="{ 'opacity-25 cursor-not-allowed': isSaving }"
				class="flex justify-center items-center px-8 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:inline-flex"
				:disabled="isSaving"
				@click.prevent="nextStep"
			>
				<span v-if="isSaving">Processing Payment ...</span>
				<span v-else>Pay {{ getCurrentCart.totalAsCurrency }}</span>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 -mr-1 ml-3 hidden sm:inline-block" viewBox="0 0 20 20" fill="currentColor">
					<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
					<path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
				</svg>
			</button>
			<div v-else v-html="paypalForm"></div>

			<nuxt-link
				v-if="getIsFirstStep"
				to="/"
				class="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:inline-flex"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 -ml-1 mr-3 hidden sm:inline-block" viewBox="0 0 20 20" fill="currentColor">
					<path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
				</svg>
				<span>Continue Shopping</span>
			</nuxt-link>

			<button
				v-else
				class="flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:inline-flex"
				@click.prevent="previousStep"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 -ml-1 mr-3 hidden sm:inline-block" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
				</svg>
				<span>Return to {{ getPreviousStep.label }}</span>
			</button>
		</div>
	</div>
</template>

<style scoped>
	#paypal-button-container,
	.paypal-rest-form {
		display: none;
	}
</style>
