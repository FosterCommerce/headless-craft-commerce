<script>
	export default {
		name: 'CartLineItem',
		props:{
			item:{
				type: Object,
				default: () => ({})
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
	<div class="flex py-6 sm:py-10">
		<div class="flex-shrink-0">
			<nuxt-img
				v-if="item.image.url"
				:src="item.image.url"
				:alt="item.image.alt"
				class="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"
				loading="lazy"
			/>
		</div>

		<div class="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
			<div class="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
				<div>
					<div class="flex justify-between">
						<h3 class="text-sm">
							<nuxt-link :to="item.uri" class="font-medium text-gray-700 hover:text-gray-800">{{ item.title }}</nuxt-link>
						</h3>
					</div>
					<div class="mt-1 flex text-sm">
						<p class="text-gray-500">{{ item.color.charAt(0).toUpperCase() + item.color.slice(1) }}</p>
						<p class="ml-4 pl-4 border-l border-gray-200 text-gray-500 uppercase">{{ item.size }}</p>
					</div>
					<p class="mt-1 text-sm font-medium text-gray-900">{{ item.priceAsCurrency }}</p>
				</div>

				<div class="mt-4 sm:mt-0 sm:pr-9">
					<div>
						<label for="quantity_6" class="sr-only">Quantity, {{ item.title }}</label>
						<input
							id="quantity_6"
							v-model="quantity"
							name="quantity_6"
							class="block max-w-[64px] rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
							type="number"
							min="0"
							@change="updateQuantity"
						/>
					</div>

					<div class="absolute top-0 right-0">
						<button type="button" class="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500" @click="removeItem">
							<span class="sr-only">Remove</span>
							<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
								<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
