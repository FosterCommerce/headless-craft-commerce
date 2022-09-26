<script>
	export default {
		name: 'ProductSizePicker',
		props: {
			options: {
				type: Array,
				default: () => []
			},
			available: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				selected: this.options.find(option => this.available.includes(option)),
			}
		},
		computed: {
			computedOptions() {
				const sizeArr = [];
				this.options.forEach((option) => {
					let style = '';
					if (!this.available.includes(option)) {
						style = 'opacity-25 cursor-not-allowed text-black bg-transparent';
					} else {
						style = option === this.selected ? 'bg-black text-white cursor-pointer' : 'text-black bg-transparent cursor-pointer';
					}
					sizeArr.push({
						label: option.toUpperCase(),
						value: option,
						disabled: !this.available.includes(option),
						style
					});
				});
				return sizeArr;
			}
		},
		methods: {
			updateSelected(option) {
				this.selected = option
				this.$emit('option-selected', {
					type: 'size',
					value: option
				});
			}
		}
	}
</script>

<template>
	<div>
		<div class="flex items-center justify-between">
			<h2 class="text-sm font-medium text-gray-900">Size</h2>
		</div>
		<fieldset class="mt-3">
			<legend class="sr-only">Choose a size</legend>
			<div class="grid grid-cols-3 gap-3 sm:grid-cols-6">
				<!--
					In Stock: "cursor-pointer", Out of Stock: "opacity-25 cursor-not-allowed"
					Active: "ring-2 ring-offset-2 ring-indigo-500"
					Checked: "bg-indigo-600 border-transparent text-white hover:bg-indigo-700", Not Checked: "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
				-->
				<label
					v-for="(option, index) in computedOptions"
					:key="index"
					:for="`size-choice-${index}`"
					:class="option.style"
					class="border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 focus:outline-none"
				>
					<input
						:id="`size-choice-${index}`"
						type="radio"
						name="size-choice"
						:value="option.value"
						class="sr-only"
						:aria-labelledby="`size-choice-${index}-label`"
						:disabled="option.disabled"
						@change="updateSelected(option.value)"
					>
					<span :id="`size-choice-${index}-label`">{{ option.label }}</span>
				</label>

				<!--
					In Stock: "cursor-pointer", Out of Stock: "opacity-25 cursor-not-allowed"
					Active: "ring-2 ring-offset-2 ring-indigo-500"
					Checked: "bg-indigo-600 border-transparent text-white hover:bg-indigo-700", Not Checked: "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
				-->
				<!-- <label class="border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 cursor-pointer focus:outline-none">
					<input type="radio" name="size-choice" value="XS" class="sr-only" aria-labelledby="size-choice-1-label">
					<span id="size-choice-1-label"> XS </span>
				</label> -->

				<!--
					In Stock: "cursor-pointer", Out of Stock: "opacity-25 cursor-not-allowed"
					Active: "ring-2 ring-offset-2 ring-indigo-500"
					Checked: "bg-indigo-600 border-transparent text-white hover:bg-indigo-700", Not Checked: "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
				-->
				<!-- <label class="border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 cursor-pointer focus:outline-none">
					<input type="radio" name="size-choice" value="S" class="sr-only" aria-labelledby="size-choice-2-label">
					<span id="size-choice-2-label"> S </span>
				</label> -->

				<!--
					In Stock: "cursor-pointer", Out of Stock: "opacity-25 cursor-not-allowed"
					Active: "ring-2 ring-offset-2 ring-indigo-500"
					Checked: "bg-indigo-600 border-transparent text-white hover:bg-indigo-700", Not Checked: "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
				-->
				<!-- <label class="border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 cursor-pointer focus:outline-none">
					<input type="radio" name="size-choice" value="M" class="sr-only" aria-labelledby="size-choice-3-label">
					<span id="size-choice-3-label"> M </span>
				</label> -->

				<!--
					In Stock: "cursor-pointer", Out of Stock: "opacity-25 cursor-not-allowed"
					Active: "ring-2 ring-offset-2 ring-indigo-500"
					Checked: "bg-indigo-600 border-transparent text-white hover:bg-indigo-700", Not Checked: "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
				-->
				<!-- <label class="border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 cursor-pointer focus:outline-none">
					<input type="radio" name="size-choice" value="L" class="sr-only" aria-labelledby="size-choice-4-label">
					<span id="size-choice-4-label"> L </span>
				</label> -->

				<!--
					In Stock: "cursor-pointer", Out of Stock: "opacity-25 cursor-not-allowed"
					Active: "ring-2 ring-offset-2 ring-indigo-500"
					Checked: "bg-indigo-600 border-transparent text-white hover:bg-indigo-700", Not Checked: "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
				-->
				<!-- <label class="border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1 opacity-25 cursor-not-allowed">
					<input type="radio" name="size-choice" value="XL" disabled class="sr-only" aria-labelledby="size-choice-5-label">
					<span id="size-choice-5-label"> XL </span>
				</label> -->
			</div>
		</fieldset>
	</div>
</template>
