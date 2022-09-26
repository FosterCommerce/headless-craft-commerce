<script>
	export default {
		name: 'BaseModal',
		props: {
			title: {
				type: String,
				required: false,
				default: null
			},
			width: {
				type: String,
				required: false,
				default: 'md'
			}
		},
		methods: {
			close() {
				this.$emit('close');
			}
		}
	};
</script>

<template>
	<div
		class="fixed z-10 inset-0 overflow-y-auto"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

			<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="close"></div>

			<!-- This element is to trick the browser into centering the modal contents. -->
			<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

			<div
				class="relative inline-block w-full align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6"
				:class="`max-w-${width}`"
			>

				<button
					type="button"
					class="absolute top-4 right-4 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					@click="close"
				>
					<span class="sr-only">Close modal</span>
					<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				<h2 v-if="title" id="modal-title" class="px-6 pb-6 text-center text-2xl font-medium text-gray-900 border-b border-gray-200">{{ title }}</h2>

				<slot />

			</div>

		</div>

	</div>
</template>
