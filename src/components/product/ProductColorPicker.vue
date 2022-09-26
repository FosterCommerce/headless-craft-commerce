<script>
	export default {
		name: 'ProductColorPicker',
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
			/** Takes the color values array and turns it into an array of objects
			 * with labels, values, and color names for Tailwind */
			computedOptions() {
				const colorArr = [];
				this.options.forEach((option) => {
					// Define the selected and disabled classes
					let style = '';
					if (!this.available.includes(option)) {
						style = 'opacity-25 cursor-not-allowed text-black bg-transparent';
					} else {
						style = option === this.selected ? 'ring ring-offset-1' : '';
					}

					// Define the Tailwind color name
					// NOTE: The dynamic Tailwind classes produced are listed below so they are not removed in JIT mode
					// bg-black bg-white bg-gray-400 bg-red-600 bg-blue-600 bg-green-600 bg-yellow-600 bg-orange-600
					let colorName = '';
					switch (option) {
						case 'white':
							colorName = 'white';
							break;
						case 'black':
							colorName = 'black';
							break;
						case 'gray':
							colorName = 'gray-400';
							break;
						case 'none':
							colorName = 'transparent';
							break;
						default:
							colorName = option + '-600';
					}

					// Add the object to the array we will return
					colorArr.push({
						label: option.charAt(0).toUpperCase() + option.slice(1),
						value: option,
						color: colorName,
						disabled: !this.available.includes(option),
						style
					});
				});
				return colorArr;
			},
		},
		methods: {
			updateSelected(color) {
				this.selected = color
				this.$emit('option-selected', {
					type: 'color',
					value: color
				});
			},
		}
	}
</script>

<template>
	<div>
		<h2 class="text-sm font-medium text-gray-900">Color</h2>
		<fieldset class="mt-3">
			<legend class="sr-only">Choose a color</legend>
			<div class="flex items-center space-x-3">
				<!--
					Active and Checked: "ring ring-offset-1"
					Not Active and Checked: "ring-2"
				-->
				<label
					v-for="(option, index) in computedOptions"
					:key="index"
					:for="`color-choice-${index}`"
					:class="option.style"
					class="-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ring-gray-900"
				>
					<input
						:id="`color-choice-${index}`"
						type="radio"
						name="color-choice"
						:value="option.value"
						class="sr-only"
						:aria-labelledby="`color-choice-${index}-label`"
						:disabled="option.disabled"
						@change="updateSelected(option.value)"
					/>
					<span :id="`color-choice-${index}-label`" class="sr-only"> {{ option.label }} </span>
					<span aria-hidden="true" :class="`bg-${option.color}`" class="h-8 w-8 border border-black border-opacity-10 rounded-full"></span>
				</label>

				<!--<label class="-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ring-gray-400">
					<input type="radio" name="color-choice" value="Heather Grey" class="sr-only" aria-labelledby="color-choice-1-label">
					<span id="color-choice-1-label" class="sr-only"> Heather Grey </span>
					<span aria-hidden="true" class="h-8 w-8 bg-gray-400 border border-black border-opacity-10 rounded-full"></span>
				</label> -->
			</div>
		</fieldset>
	</div>
</template>
