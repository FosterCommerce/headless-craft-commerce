<script>
	import { mapGetters } from "vuex";

	export default {
		name: "CheckoutAddressFields",
		props: {
			context: {
				type: String,
				required: false,
				default: 'shipping'
			},
			value: {
				type: Object,
				required: false,
				default: () => ({
					id: 0,
					title: '',
					firstName: '',
					lastName: '',
					fullName: '',
					organization: '',
					addressLine1: '',
					addressLine2: '',
					locality: '',
					administrativeArea: '',
					countryCode: '',
					postalCode: '',
					phone: ''
				})
			},
			useFullName: {
				type: Boolean
			}
		},
		computed: {
			...mapGetters('checkout', [
				'getCountries',
				'getRegions'
			]),
			/** Gets the countries regions based on the country code */
			countryRegions() {
				let regions = null;
				if (this.value.countryCode && this.value.countryCode in this.getRegions) {
					regions = this.getRegions[this.value.countryCode];
				}
				return !Array.isArray(regions) ? regions : null;
			},
			contextName() {
				return this.context.charAt(0).toUpperCase() + this.context.slice(1);
			},
		},
		methods: {
			update(key, value) {
				this.$emit('input', { ...this.value, [key]: value });
			}
		}
	}
</script>

<template>
	<div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
		<div v-if="useFullName" class="sm:col-span-6">
			<label :for="`${contextName}FullName-${value.id}`" class="block text-sm font-medium text-gray-700">Your Full Name</label>
			<div class="mt-1">
				<input
					:id="`${contextName}FullName-${value.id}`"
					:name="`${contextName}FullName`"
					type="text"
					class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
					:value="value.fullName"
					@input="update('fullName', $event.target.value)"
				/>
			</div>
		</div>

		<div v-if="!useFullName" class="sm:col-span-3">
			<label :for="`${contextName}FirstName-${value.id}`" class="block text-sm font-medium text-gray-700">First Name</label>
			<div class="mt-1">
				<input
					:id="`${contextName}FirstName-${value.id}`"
					:name="`${contextName}FirstName`"
					type="text"
					autocomplete="given-name"
					class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
					:value="value.firstName"
					@input="update('firstName', $event.target.value)"
				/>
			</div>
		</div>

		<div v-if="!useFullName" class="sm:col-span-3">
			<label :for="`${contextName}LastName-${value.id}`" class="block text-sm font-medium text-gray-700">Last Name</label>
			<div class="mt-1">
				<input
					:id="`${contextName}LastName-${value.id}`"
					:name="`${contextName}LastName`"
					type="text"
					autocomplete="family-name"
					class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
					:value="value.lastName"
					@input="update('lastName', $event.target.value)"
				/>
			</div>
		</div>

		<div class="sm:col-span-6">
			<div class="flex justify-between">
				<label :for="`${contextName}Organization-${value.id}`" class="block text-sm font-medium text-gray-700">Company</label>
				<span :id="`${contextName}Organization-optional-${value.id}`" class="text-sm text-gray-400">Optional</span>
			</div>
			<div class="mt-1">
				<input
					:id="`${contextName}Organization-${value.id}`"
					:name="`${contextName}Organization`"
					:aria-describedby="`${contextName}Organization-optional-${value.id}`"
					type="text"
					class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					:value="value.organization"
					@input="update('organization', $event.target.value)"
				/>
			</div>
		</div>

		<div class="sm:col-span-4">
			<label :for="`${contextName}AddressLine1-${value.id}`" class="block text-sm font-medium text-gray-700">Street Address</label>
			<div class="mt-1">
				<input
					:id="`${contextName}AddressLine1-${value.id}`"
					:name="`${contextName}AddressLine1`"
					type="text"
					autocomplete="street-address"
					class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
					:value="value.addressLine1"
					@input="update('addressLine1', $event.target.value)"
				/>
			</div>
		</div>

		<div class="sm:col-span-2">
			<div class="flex justify-between">
				<label :for="`${contextName}AddressLine2-${value.id}`" class="block text-sm font-medium text-gray-700">Apt.</label>
				<span :id="`${contextName}AddressLine2-optional-${value.id}`" class="text-sm text-gray-400">Optional</span>
			</div>
			<div class="mt-1">
				<input
					:id="`${contextName}AddressLine2-${value.id}`"
					type="text"
					:name="`${contextName}AddressLine2`"
					class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					:aria-describedby="`${contextName}AddressLine2-optional${value.id}`"
					:value="value.addressLine2"
					@input="update('addressLine2', $event.target.value)"
				/>
			</div>
		</div>

		<div class="sm:col-span-2">
			<label :for="`${contextName}Locality-${value.id}`" class="block text-sm font-medium text-gray-700">City</label>
			<div class="mt-1">
				<input
					:id="`${contextName}Locality-${value.id}`"
					type="text"
					:name="`${contextName}Locality`"
					autocomplete="address-level2"
					class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
					:value="value.locality"
					@input="update('locality', $event.target.value)"
				/>
			</div>
		</div>

		<div class="sm:col-span-2">
			<label :for="`${contextName}AdministrativeArea-${value.id}`" class="block text-sm font-medium text-gray-700">State / Province</label>
			<div class="mt-1">
				<select
					v-if="countryRegions"
					:id="`${contextName}AdministrativeArea-${value.id}`"
					:name="`${contextName}AdministrativeArea`"
					autocomplete="address-level1"
					class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
					:value="value.administrativeArea"
					@change="update('administrativeArea', $event.target.value)"
				>
					<option v-for="(name, regionValue) in countryRegions" :key="regionValue" :value="regionValue">{{ name }}</option>
				</select>
				<input
					v-else
					:id="`${contextName}AdministrativeArea-${value.id}`"
					type="text"
					:name="`${contextName}AdministrativeArea`"
					autocomplete="address-level1"
					class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
					:value="value.administrativeArea"
					@input="update('administrativeArea', $event.target.value)"
				/>
			</div>
		</div>

		<div class="sm:col-span-2">
			<label :for="`${contextName}CountryCode-${value.id}`" class="block text-sm font-medium text-gray-700">Country</label>
			<div class="mt-1">
				<select
					:id="`${contextName}CountryCode-${value.id}`"
					:name="`${contextName}CountryCode`"
					autocomplete="country-name"
					class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
					:value="value.countryCode"
					@change="update('countryCode', $event.target.value)"
				>
					<option v-for="(name, countryValue) in getCountries" :key="countryValue" :value="countryValue">{{ name }}</option>
				</select>
			</div>
		</div>

		<div class="sm:col-span-3">
			<label :for="`${contextName}PostalCode-${value.id}`" class="block text-sm font-medium text-gray-700">Postal code</label>
			<div class="mt-1">
				<input
					:id="`${contextName}PostalCode-${value.id}`"
					type="text"
					:name="`${contextName}PostalCode`"
					autocomplete="postal-code"
					class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
					:value="value.postalCode"
					@input="update('postalCode', $event.target.value)"
				/>
			</div>
		</div>

		<div class="sm:col-span-3">
			<div class="flex justify-between">
				<label :for="`${contextName}Phone-${value.id}`" class="block text-sm font-medium text-gray-700">Phone</label>
				<span :id="`${contextName}Phone-optional-${value.id}`" class="text-sm text-gray-400">Optional</span>
			</div>
			<div class="mt-1">
				<input
					:id="`${contextName}Phone-${value.id}`"
					type="tel"
					:name="`${contextName}Phone`"
					autocomplete="tel"
					class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					:aria-describedby="`${contextName}Phone-optional${value.id}`"
					:value="value.phone"
					@input="update('phone', $event.target.value)"
				/>
			</div>
		</div>
	</div>
</template>
