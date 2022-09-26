<script>
	import { mapActions } from "vuex";

	export default {
		name: 'AddressFormEdit',
		props: {
			address: {
				type: Object,
				required: false,
				default: () => ({
					id: '',
					firstName: '',
					lastName: '',
					organization: '',
					addressLine1: '',
					addressLine2: '',
					locality: '',
					administrativeArea: '',
					countryCode: '',
					postalCode: '',
					phone: ''
				})
			}
		},
		data() {
			return {
				addressData: JSON.parse(JSON.stringify(this.address)),
				error: ''
			};
		},
		methods: {
			...mapActions('user', [
				'fetchAddresses',
				'saveAddress'
			]),
			close() {
				this.$emit('close');
			},
			async saveUserAddress() {
				await this.saveAddress(this.addressData);
				await this.fetchAddresses();
				this.close();
			}
		}
	};
</script>

<template>
	<form class="mt-6 space-y-6">
		<CheckoutAddressFields v-model="addressData" context="user" :use-full-name="true" />

		<div class="flex flex-col space-y-3 pt-6 border-t border-gray-200 sm:flex-row-reverse sm:justify-between sm:items-center sm:space-y-0">
			<button
				type="submit"
				class="flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:inline-flex"
				@click.prevent="saveUserAddress"
			>
				Save Address
			</button>

			<button
				type="button"
				class="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:inline-flex"
				@click="close"
			>
				Cancel
			</button>
		</div>
	</form>
</template>
