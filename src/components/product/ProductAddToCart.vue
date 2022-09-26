<script>
	import { mapGetters, mapActions } from 'vuex';

	export default {
		name: 'ProductAddToCart',
		props: {
			/** The Commerce purchasable object  */
			purchasable: {
				type: Object,
				required: true
			},
			/** The amount of the purchasable to add to the cart */
			qty: {
				type: [Number, String],
				required: true
			},
			/** Redirect to a URL after adding the item to the cart? */
			redirect: {
				type: String,
				required: false,
				default: null
			}
		},
		data() {
			return {
				isSaving: false
			};
		},
		computed: {
			...mapGetters('cart', [
				'getCartErrors'
			]),
			/** Returns the redirect path with a forward slash if it does not have one */
			redirectPath() {
				if (this.redirect) {
					return this.redirect.startsWith('/') ? this.redirect : ('/' + this.redirect);
				} else {
					return null;
				}
			}
		},
		methods: {
			...mapActions('cart', [
				'addNewItem'
			]),
			/** Adds the item to the cart via the cart Vuex action */
			async addToCart() {
				this.isSaving = true;
				await this.addNewItem({ ...this.purchasable, qty: Number(this.qty) });
				this.isSaving = false;
				if (this.redirectPath && this.getCartErrors.length === 0) {
					await this.$router.push(this.redirectPath);
				}
			}
		}
	};
</script>

<template>
	<button
		type="button"
		:class="{ 'opacity-25 cursor-not-allowed': isSaving }"
		class="mt-8 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		:disabled="isSaving"
		@click='addToCart'
	>
		<span v-if="isSaving">Adding to cart ...</span>
		<span v-else>Add to cart</span>
	</button>
</template>

