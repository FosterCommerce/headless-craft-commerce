<script>
	import { mapGetters, mapActions } from 'vuex';

	export default {
		name: "CheckoutStepEmail",
		data() {
			return {
				email: '',
				loginModalOpen: false,
				isSaving: false,
				isLoading: false,
			}
		},
		async fetch() {

			if (process.client) {
				// Set the loading state
				this.isLoading = true;

				// Fetch the cart when this step component loads
				await this.$store.dispatch('cart/fetchCart');

				// If the cart already has an email, then lets use it
				if (this.getEmail) {
					this.email = this.getEmail;
				}

				// Set the loading state
				this.isLoading = false;
			}
		},
		computed: {
			...mapGetters('user', [
				'getIsGuest'
			]),
			...mapGetters('checkout', [
				'getPreviousStep',
				'getNextStep',
				'getIsFirstStep'
			]),
			...mapGetters('cart', [
				'getEmail',
				'getCartErrors'
			])
		},
		methods: {
			...mapActions('checkout', [
				'incrementStep',
				'decrementStep'
			]),
			...mapActions('cart', [
				'saveEmail',
				'displayNotice'
			]),
			toggleLoginModal() {
				this.loginModalOpen = !this.loginModalOpen;
			},
			async nextStep() {

				if (this.email === '') {

					// Display an error message if there is no email address

					this.displayNotice('Your email address is required');

				} else {

					// If we have an email address, try and save it to the cart

					this.isSaving = true;

					await this.saveEmail(this.email);

					this.isSaving = false;

					if (this.getCartErrors.length === 0) {
						this.incrementStep();
					}

				}
			},
			previousStep() {
				this.decrementStep();
			}
		}
	}
</script>

<template>
	<section aria-labelledby="contact-info-heading">

		<h2 id="contact-info-heading" class="text-xl font-medium text-gray-900 lg:text-2xl">Where should we send your receipt?</h2>

		<div v-if="!isLoading">

			<p v-if="getIsGuest" class="text-sm text-gray-500">
				Already have an account?
				<a href="#" class="text-indigo-600" @click.prevent="toggleLoginModal">Log in.</a>
			</p>

			<div class="mt-6">
				<label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
				<div class="mt-1">
					<input
						id="email"
						v-model="email"
						type="email"
						name="email"
						autocomplete="email"
						class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						required
					>
				</div>
			</div>

			<div class="relative flex items-start mt-6">
				<div class="flex items-center h-5">
					<input
						id="newsletter"
						aria-describedby="newsletter-description"
						name="newsletter"
						type="checkbox"
						class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
					>
				</div>
				<div class="ml-3 text-sm">
					<label for="newsletter" class="font-medium text-gray-700">Signup for our newsletter</label>
					<span id="newsletter-description" class="text-gray-500">
					<span class="sr-only">Signup for our newsletter</span> so you always know what's happening.
				</span>
				</div>
			</div>

			<div class="flex flex-col justify-start items-stretch gap-y-4 pt-8 sm:flex-row-reverse sm:justify-between sm:items-center lg:pt-16">
				<button
					:class="{ 'opacity-25 cursor-not-allowed': isSaving }"
					class="flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:inline-flex"
					:disabled="isSaving"
					@click.prevent="nextStep"
				>
					<span v-if="isSaving">Saving Email ...</span>
					<span v-else>Continue to {{ getNextStep.label }}</span>
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

		</div>

		<div v-else class="py-12 flex justify-center items-end">
			<BaseLoader />
		</div>

		<BaseModal v-if="loginModalOpen" title="Sign in to your account" @close="toggleLoginModal">
			<LoginForm />
		</BaseModal>
	</section>
</template>
