<script>
	import { mapGetters, mapActions } from "vuex";

	export default {
		name: "CheckoutStepShipping",
		data() {
			return {
				shippingMethodHandle: null,
				isSaving: false,
			};
		},
		computed: {
			...mapGetters('checkout', [
				'getPreviousStep',
				'getNextStep',
				'getIsFirstStep'
			]),
			...mapGetters('cart', [
				'getShippingMethodHandle',
				'getAvailableShippingMethodOptions'
			]),
			shippingMethods() {
				const options = [];
				Object.entries(this.getAvailableShippingMethodOptions).forEach(([key, option]) => {
					options.push(option);
				});
				return options;
			}
		},
		watch: {
			shippingMethodHandle() {
				this.saveShippingMethod(this.shippingMethodHandle);
			}
		},
		mounted() {
			if (!this.getShippingMethodHandle) {
				this.shippingMethodHandle = this.shippingMethods[0].handle;
			} else {
				this.shippingMethodHandle = this.getShippingMethodHandle;
			}
		},
		methods: {
			...mapActions('cart', [
				'saveShippingMethod'
			]),
			...mapActions('checkout', [
				'decrementStep',
				'incrementStep'
			]),
			nextStep() {
				// ... Code to save the data back to Commerce here
				// and if there are no errors we can then increment the step
				this.incrementStep();
			},
			previousStep() {
				// ... Any code that needs to happen here before
				// stepping back in the process
				this.decrementStep();
			}
		}
	}
</script>

<template>
	<section aria-labelledby="shipping-heading">
		<h2 id="shipping-heading" class="text-xl font-medium text-gray-900 lg:text-2xl">Shipping method</h2>
		<p class="text-sm text-gray-500">Select a shipping method.</p>

		<div class="mt-6">
			<div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
				<label
					v-for="method in shippingMethods"
					:key="method.handle"
					:for="`shippingMethod_${method.handle}`"
					class="relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none"
					:class="`${ method.handle === shippingMethodHandle ? 'border-transparent' : 'border-gray-300' }`"
				>
					<input
						:id="`shippingMethod_${method.handle}`"
						v-model="shippingMethodHandle"
						type="radio"
						name="shippingMethodHandle"
						class="sr-only"
						:aria-labelledby="`shippingMethod_${method.handle}_label`"
						:aria-describedby="`shippingMethod_${method.handle}_description_0 shippingMethod_${method.handle}_description_1`"
						:value="method.handle"
						:checked="method.handle === shippingMethodHandle"
					>

					<div class="flex-1 flex">
						<div class="flex flex-col">
							<span :id="`shippingMethod_${method.handle}_label`" class="block text-sm font-medium text-gray-900">{{ method.name }}</span>
							<span :id="`shippingMethod_${method.handle}_description_0`" class="mt-1 flex items-center text-sm text-gray-500">{{ method.description }}</span>
							<span :id="`shippingMethod_${method.handle}_description_1`" class="mt-6 text-sm font-medium text-gray-900">{{ method.priceAsCurrency }}</span>
						</div>
					</div>

					<svg v-show="method.handle === shippingMethodHandle" class="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>

					<div class="absolute -inset-px rounded-lg border-2 pointer-events-none" :class="`${method.handle === shippingMethodHandle ? 'border-indigo-500' : 'border-transparent'}`" aria-hidden="true"></div>
				</label>
			</div>
		</div>

		<div class="flex flex-col justify-start items-stretch gap-y-4 pt-8 sm:flex-row-reverse sm:justify-between sm:items-center lg:pt-16">
			<button
				class="flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:inline-flex"
				@click.prevent="nextStep"
			>
				<span>Continue to {{ getNextStep.label }}</span>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 -mr-1 ml-3 hidden sm:inline-block" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
				</svg>
			</button>

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
	</section>
</template>
