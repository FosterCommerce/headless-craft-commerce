<script>
	export default {
		props: {
			entry: {
				type: Object,
				required: true,
			}
		}
	};
</script>

<template>
	<div class="flex flex-col border-b border-gray-200 lg:border-0">
		<div class="relative">
			<div aria-hidden="true" class="hidden absolute w-1/2 h-full bg-gray-100 lg:block"></div>
			<div class="relative bg-gray-100 lg:bg-transparent">
				<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-2">
					<div class="max-w-2xl mx-auto py-24 lg:py-64 lg:max-w-none">
						<div class="lg:pr-16">
							<h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:tracking-tight sm:text-5xl xl:tracking-tight xl:text-6xl">
								{{ entry.heading }}
							</h1>
							<p v-if="entry.summary" class="mt-4 text-xl text-gray-600">
								{{ entry.summary }}
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="w-full h-48 sm:h-64 lg:absolute lg:top-0 lg:right-0 lg:w-1/2 lg:h-full">
				<figure class="w-full h-full">
					<nuxt-img
						:src="entry.image[0].url"
						alt=""
						class="w-full h-full object-center object-cover"
						loading="lazy"
					/>
				</figure>
			</div>
		</div>
	</div>
</template>
