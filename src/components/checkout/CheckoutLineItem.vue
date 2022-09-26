<script>
	export default {
		name: 'CheckoutLineItem',
		props: {
			/** The line item data from Craft */
			item: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				quantity: this.item.qty
			}
		},
		methods: {
			removeItem(){
				this.$store.dispatch('cart/removeItem', this.item)
			},
			async updateQuantity(e){
				const successfull = await this.$store.dispatch('cart/setItemQty', {...this.item, qty: Number(e.target.value)})
				if (!successfull) {
					this.quantity = this.item.qty
				}
			}
		},
	};
</script>

<template>
	<div class="flex py-6 space-x-6">
		<nuxt-img
			v-if="item.image.url"
			:src="item.image.url"
			:alt="item.image.alt"
			class="flex-none w-40 h-40 object-center object-cover bg-gray-200 rounded-md"
			loading="lazy"
		/>
		<div class="flex flex-col justify-between space-y-4">
			<div class="text-sm font-medium space-y-1">
				<h3 class="text-gray-900 sm:text-base">{{ item.title }}</h3>
				<div class="mt-1 flex text-sm">
					<p class="text-gray-500">{{ item.color.charAt(0).toUpperCase() + item.color.slice(1) }}</p>
					<p class="ml-4 pl-4 border-l border-gray-200 text-gray-500 uppercase">{{ item.size }}</p>
				</div>
				<p class="text-gray-900">{{ item.priceAsCurrency }}</p>
			</div>
			<div class="space-y-4 sm:flex sm:space-x-4 sm:space-y-0">
				<div>
					<label for="quantity_5" class="sr-only">Quantity, {{ item.title }}</label>
					<input
						id="quantity_5"
						v-model="quantity"
						name="quantity_5"
						class="block max-w-[64px] rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						type="number"
						@change="updateQuantity"
					/>
				</div>
				<button
					type="button"
					class="inline-flex justify-start items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
					@click="removeItem"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
					</svg>
					<span>Remove</span>
				</button>
			</div>
		</div>
	</div>
</template>

