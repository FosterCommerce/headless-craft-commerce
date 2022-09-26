<script>
	import { mapGetters } from "vuex";

	export default {
		name: 'CheckoutHeader',
		computed: {
			...mapGetters('checkout', [
				'getSteps',
				'getCurrentStepNumber',
				'getTotalSteps'
			])
		}
	}
</script>

<template>
  <header class="relative bg-white border-b border-gray-200 text-sm font-medium text-gray-400 transition-opacity duration-300">
    <div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="relative flex justify-end sm:justify-center">
        <nuxt-link to="/" class="absolute left-0 top-1/2 -mt-4">
          <span class="sr-only">Foster Clothing</span>
          <img src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600" alt="" class="h-8 w-auto">
        </nuxt-link>
        <div aria-label="Progress" class="hidden sm:block">
          <ol role="list" class="flex space-x-1 md:space-x-4">
            <li v-for="(step, index) in getSteps" :key="index" class="flex items-center">
              <span aria-current="page" :class="{ 'text-indigo-600': index === getCurrentStepNumber }">{{ step.label }}</span>
              <svg v-if="(index + 1) < getSteps.length" class="w-5 h-5 text-gray-300 ml-1 md:ml-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </li>
          </ol>
        </div>
        <p class="sm:hidden">Step {{ getCurrentStepNumber + 1 }} of {{ getTotalSteps }}</p>
      </div>
    </div>
  </header>
</template>
