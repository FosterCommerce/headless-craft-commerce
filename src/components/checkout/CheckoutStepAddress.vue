<script>
	import { mapGetters, mapActions } from "vuex";
	import Addresses from '@/queries/Addresses.gql';

	export default {
		name: "CheckoutStepAddress",
		data() {
			return {
				editModalOpen: false,
				deleteModalOpen: false,
				loadedAddress: null,
				shippingAddress: 'new',
				newAddress: {
					id: '',
					title: 'Shipping Address',
					fullName: '',
					organization: '',
					addressLine1: '',
					addressLine2: '',
					locality: '',
					administrativeArea: '',
					countryCode: '',
					postalCode: '',
					phone: ''
				},
				isLoading: false, // Loading state of the component
				isSaving: false, // Saving state of the component
			}
		},
		async fetch() {

			if (process.client) {

				// Set the loading state
				this.isLoading = true;

				// Fetch the cart when this step component loads
				/* await this.$store.dispatch('cart/fetchCart');
				await this.$store.dispatch('user/fetchAddresses'); */

				// Run the logic to set the local shippingAddress variable that we use for the address toggle

				if (!this.getShippingAddressId && !this.getSourceShippingAddressId) {

					// There is no shipping address set, and no source shipping address set ...
					// This means there is no shipping address in the cart, so for our UI we will
					// want to set it to the first of our users addresses (if they have any saved)

					if (this.getAddresses && this.getAddresses.length) {
						this.shippingAddress = this.getAddresses[0].id;
					} else {
						this.shippingAddress = 'new';
					}

				} else if (this.getShippingAddressId && !this.getSourceShippingAddressId) {

					// There is a shipping address, but there is no source ID so its not related to a users saved address ...
					// This is probably because the user is a guest, but they have already input a shipping address so
					// we want to get the data from that address and save it to the 'newAddress' local data so it will be editable

					const { data } = await this.$api.graphqlQuery(
						Addresses,
						{
							id: this.getShippingAddressId,
							limit: 1
						}
					);

					if (data.addresses.length) {
						this.newAddress = data.addresses[0];
						this.newAddress.id = '';
					}

					this.shippingAddress = 'new';

				} else {

					// There is both a shipping address ID and a source address ID so it is related to a users saved address ...
					// As such we will loop through the users addresses and find the match

					this.getAddresses.forEach((address) => {
						if (parseInt(address.id) === parseInt(this.getSourceShippingAddressId)) {
							this.shippingAddress = address.id;
						}
					});

				}

				// Set the loading state
				this.isLoading = false;

			}

		},
		computed: {
			...mapGetters('user', [
				'getIsGuest',
				'getAddresses'
			]),
			...mapGetters('checkout', [
				'getPreviousStep',
				'getNextStep',
				'getIsFirstStep'
			]),
			...mapGetters('cart', [
				'getEmail',
				'getShippingAddressId',
				'getSourceShippingAddressId',
				'getShippingAddress',
				'getCartErrors'
			]),
		},
		methods: {
			...mapActions('user', [
				'fetchAddresses',
				'saveAddress',
			]),
			...mapActions('checkout', [
				'decrementStep',
				'incrementStep'
			]),
			...mapActions('cart', [
				'saveShippingAddress',
				'displayNotice'
			]),

			loadAddress(id) {
				const address = this.getAddresses.filter((address) => {
					return address.id === id;
				});
				this.loadedAddress = address.length ? address[0] : null;
			},

			toggleEditAddressModal() {
				this.editModalOpen = !this.editModalOpen;
			},

			toggleDeleteAddressModal() {
				this.deleteModalOpen = !this.deleteModalOpen;
			},

			editUserAddress(id) {
				this.loadAddress(id);
				this.toggleEditAddressModal();
			},

			deleteUserAddress(id) {
				this.loadAddress(id);
				this.toggleDeleteAddressModal();
			},

			async nextStep() {

				// Set the 'saving' state and initialise the 'selectedAddress' variable we will use
				this.isSaving = true;
				let selectedAddress = null;

				if (this.shippingAddress === 'new') {

					// This is a new address to add

					if (!this.getIsGuest) {

						// The user is logged in, so let's save the address to their addresses,
						// and set it as the 'selectedAddress' we will use.

						selectedAddress = await this.saveAddress(this.newAddress);

					} else {

						// The user is a guest, so lets just set the 'selectedAddress' we will use to what is
						// in the 'newAddress' local data

						selectedAddress = this.newAddress;

					}

				} else {

					// This is an existing address, so let's find it in the users saved addresses

					const userAddresses = this.getAddresses.filter((address) => {
						return parseInt(address.id) === parseInt(this.shippingAddress);
					});
					selectedAddress = userAddresses.length ? userAddresses[0] : this.newAddress;

				}

				// Now that we have the address to save as the shipping address in the cart, lets save it,
				// and if not, let's show the user an error instead.

				if (selectedAddress) {
					await this.saveShippingAddress(selectedAddress);
					if (this.getCartErrors.length === 0) {
						this.incrementStep();
					}
				} else {
					this.displayNotice('You must include a valid shipping address');
				}

				// Set the 'saving' state to false
				this.isSaving = false;

			},
			previousStep() {
				this.decrementStep();
			}
		}
	}
</script>

<template>
	<section aria-labelledby="address-heading">
		<h2 id="address-heading" class="text-xl font-medium text-gray-900 lg:text-2xl">Where should we mail your order?</h2>

		<div v-if="!isLoading">

			<p v-if="!getIsGuest && getAddresses.length" class="text-sm text-gray-500">Select one of your saved addresses or add a new one.</p>

			<div v-if="!getIsGuest && getAddresses.length" class="mt-6 divide-y divide-gray-200">

				<div v-for="address in getAddresses" :key="address.id" class="relative flex items-start py-4">
					<div class="min-w-0 flex-1 text-sm">
						<label :for="`address_${address.id}`" class="font-medium text-gray-700">
							<span v-if="address.organization">{{ address.organization }} - {{ address.firstName }} {{ address.lastName }}</span>
							<span v-if="!address.organization">{{ address.firstName }} {{ address.lastName }}</span>
						</label>
						<p :id="`address_${address.id}_description`" class="text-gray-500">
							<span>{{ address.addressLine1 }},</span>
							<span v-if="address.addressLine2">{{ address.addressLine2 }},</span>
							<br/><span>{{ address.locality }},</span>
							<span>{{ address.administrativeArea }},</span>
							<span>{{ address.postalCode }},</span>
							<span>{{ address.countryCode }}</span>
						</p>
						<div class="flex justify-start space-x-2">
							<button
								type="button"
								class="inline-flex items-center mt-2 px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								@click="editUserAddress(address.id)"
							>
								Edit
							</button>
							<button
								type="button"
								:class="{ 'opacity-25 cursor-not-allowed': parseInt(address.id) === parseInt(shippingAddress) }"
								class="inline-flex items-center mt-2 px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								:disabled="parseInt(address.id) === parseInt(shippingAddress)"
								@click="deleteUserAddress(address.id)"
							>
								Delete
							</button>
						</div>
					</div>
					<div class="ml-3 flex items-center h-5">
						<input
							:id="`address_${address.id}`"
							v-model="shippingAddress"
							:aria-describedby="`address_${address.id}_description`"
							name="address"
							type="radio"
							:value="address.id"
							class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
						/>
					</div>
				</div>

				<div class="relative flex items-start py-4">
					<div class="min-w-0 flex-1 text-sm">
						<label for="address_0" class="font-medium text-gray-700">New Address</label>
						<p id="address_0_description" class="text-gray-500">Use a different shipping address</p>
					</div>
					<div class="ml-3 flex items-center h-5">
						<input
							id="address_0"
							v-model="shippingAddress"
							aria-describedby="address_0_description"
							name="address"
							type="radio"
							value="new"
							class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
						/>
					</div>
				</div>

			</div>

			<div v-show="shippingAddress === 'new'">

				<CheckoutAddressFields v-model="newAddress" context="shipping" :use-full-name="true" />

				<div v-if="getIsGuest" class="mt-6 sm:col-span-6">
					<div class="relative flex items-start">
						<div class="flex items-center h-5">
							<input
								id="create-account"
								aria-describedby="create-account-description"
								name="create-account"
								type="checkbox"
								class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
							/>
						</div>
						<div class="ml-3 text-sm">
							<label for="create-account" class="font-medium text-gray-700">Create an account</label>
							<span id="create-account-description" class="text-gray-500">
							<span class="sr-only">Create an account</span> to save this information for next time.
						</span>
						</div>
					</div>
				</div>

			</div>

			<div class="mt-12">
				<div class="flex justify-between">
					<label for="instructions" class="block text-sm font-medium text-gray-700">Special Instructions</label>
					<span id="instructions-optional" class="text-sm text-gray-400">Optional</span>
				</div>
				<div class="mt-1">
				<textarea
					id="instructions"
					rows="4"
					name="instructions"
					class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
					aria-describedby="instructions-optional"
				></textarea>
				</div>
			</div>

			<div class="flex flex-col justify-start items-stretch gap-y-4 pt-8 sm:flex-row-reverse sm:justify-between sm:items-center lg:pt-16">
				<button
					:class="{ 'opacity-25 cursor-not-allowed': isSaving }"
					class="flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:inline-flex"
					:disabled="isSaving"
					@click.prevent="nextStep"
				>
					<span v-if="isSaving">Saving Address ...</span>
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

		<BaseModal v-if="editModalOpen" title="Edit your address" width="xl" @close="toggleEditAddressModal">
			<AddressFormEdit :address="loadedAddress" @close="toggleEditAddressModal" />
		</BaseModal>

		<BaseModal v-if="deleteModalOpen" title="Delete this address?" @close="toggleDeleteAddressModal">
			<AddressFormDelete :address="loadedAddress" @close="toggleDeleteAddressModal" />
		</BaseModal>
	</section>
</template>
