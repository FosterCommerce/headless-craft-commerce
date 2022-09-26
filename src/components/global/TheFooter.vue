<script>
	export default {
		name: 'TheFooter',
		computed: {
			copyrightYear() {
				const currentDate = new Date();
				return currentDate.getFullYear();
			}
		}
	}
</script>

<template>
  <footer aria-labelledby="footer-heading">
    <h2 id="footer-heading" class="sr-only">Footer</h2>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="border-t border-gray-100 py-10 text-center">
        <p class="text-sm text-gray-500">&copy; {{ copyrightYear }} Foster Clothing, Inc. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
