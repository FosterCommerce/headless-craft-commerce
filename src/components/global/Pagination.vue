<script>
	export default {
		name: 'Pagination',
		props: {
			numPages: {
				type: Number,
				required: true,
			},
			page: {
				type: Number,
				required: true,
			},
		},
		computed: {
			pagesToShow() {
				const result = [];

				if (this.page > 3) {
					if (this.page < this.numPages - 4) {
						result.push(...[
							this.page - 2,
							this.page - 1,
						]);
					} else {
						const offset = this.numPages > 6 ? this.page + 6 : this.page + 5;
						let numToShow = offset - this.numPages;

						while (numToShow) {
							result.push(this.page - numToShow);
							numToShow--;
						}
					}

					if (this.page < this.numPages) {
						result.push(this.page);
					}

					if ((this.page + 1) < this.numPages) {
						result.push(this.page + 1);
					}

					if ((this.page + 2) < this.numPages) {
						result.push(this.page + 2);
					}
				} else {
					const num = this.numPages > 5 ? 6 : this.numPages + 1;

					for (let i = 1; i < num; i++) {
						result.push(i);
					}
				}

				return result;
			},
		},
	};
</script>

<template>
	<nav aria-label="Pagination">
		<div class="btn-container min-w-0 flex-1">
			<a
				v-if="page > 1"
				href="#"
				@click.prevent="$emit('set-page', page - 1)"
			>
				Previous
			</a>
		</div>

		<ul class="btn-container hidden space-x-2 sm:flex">
			<li
				v-for="pageNumber of pagesToShow"
				:key="pageNumber"
			>
				<a
					:class="pageNumber === page ? 'current' : ''"
					href="#"
					@click.prevent="$emit('set-page', pageNumber)"
				>
					{{ pageNumber }}
				</a>
			</li>
			<li v-if="numPages > 6 && page < numPages - 3">
				<span class="inline-flex items-center text-gray-500 px-1.5 h-10">
					...
				</span>
			</li>
			<li v-if="numPages > 5">
				<a
					:class="page === numPages ? 'current' : ''"
					href="#"
					@click.prevent="$emit('set-page', numPages)"
				>
					{{ numPages }}
				</a>
			</li>
		</ul>

		<div class="btn-container min-w-0 flex-1 flex justify-end">
			<a
				v-if="page < numPages"
				href="#"
				@click.prevent="$emit('set-page', page + 1)"
			>
				Next
			</a>
		</div>
	</nav>
</template>

<style scoped lang="postcss">
	nav {
		@apply max-w-7xl mx-auto px-4 mt-6 flex justify-between text-sm font-medium text-gray-700;
		@apply sm:px-6 lg:px-8;
	}

	.btn-container {
		a {
			@apply inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white;
			@apply hover:bg-gray-100 focus:outline-none focus:border-indigo-600 focus:ring-2;
			@apply focus:ring-offset-1 focus:ring-offset-indigo-600 focus:ring-indigo-600;
			@apply focus:ring-opacity-25;

			&.current {
				@apply border-indigo-600 ring-1 ring-indigo-600;
			}
		}
	}
</style>
