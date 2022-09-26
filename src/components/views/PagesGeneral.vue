<script>
	export default {
		name: 'PagesGeneral',
		props: {
			entry: {
				type: Object,
				required: true,
			}
		}
	};
</script>

<template>
	<div>
		<!-- Page Header -->
		<header class="bg-white">
			<div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
				<div class="text-center">
					<p class="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">{{ entry.title }}</p>
					<p class="max-w-xl mt-5 mx-auto text-xl text-gray-500">Start building for free, then add a site plan to go live. Account plans unlock additional features.</p>
				</div>
			</div>
		</header>

		<!-- Page Content -->
		<div class="relative px-4 sm:px-6 lg:px-8">
			<div class="mt-6 mx-auto prose prose-indigo prose-lg text-gray-500">
				<ContentBlocks :blocks="entry.contentBlocks" />
			</div>
		</div>
	</div>
</template>

