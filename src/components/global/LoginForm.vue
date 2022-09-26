<script>
	export default {
		name: "LoginForm",
		data() {
			return {
				email: '',
				password: '',
				rememberMe: '',
				error: ''
			};
		},
		methods: {
			async login() {
				try {
					const result = await this.$api.postAction('/users/login', {
						loginName: this.email,
						password: this.password,
						rememberMe: this.rememberMe,
					});

					await this.$store.dispatch('user/fetchSessionData')
				} catch (error) {
					this.error = error.response?.data?.message;
				}
			},
		},
	}
</script>

<template>
	<form class="mt-6 space-y-6" @submit.prevent="login">

		<div>
			<label for="login-email" class="block text-sm font-medium text-gray-700"> Email address </label>
			<div class="mt-1">
				<input
					id="login-email"
					name="email"
					type="email"
					autocomplete="email"
					class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
					v-model="email"
				>
			</div>
		</div>

		<div>
			<label for="login-password" class="block text-sm font-medium text-gray-700"> Password </label>
			<div class="mt-1">
				<input
					id="login-password"
					name="password"
					type="password"
					autocomplete="current-password"
					class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
					v-model="password"
				>
			</div>
		</div>

		<div v-if="error" class="rounded-md bg-red-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
				</div>
			</div>
		</div>

		<div class="flex items-center justify-between">

			<div class="flex items-center">
				<input
					v-model="rememberMe"
					true-value="y"
					false-value=""
					id="login-remember-me"
					name="login-remember-me"
					type="checkbox"
					class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
				>
				<label for="login-remember-me" class="ml-2 block text-sm text-gray-900"> Remember me </label>
			</div>

			<div class="text-sm">
				<a href="#" class="font-medium text-indigo-600 hover:text-indigo-500"> Forgot your password? </a>
			</div>

		</div>

		<div>
			<button
				type="submit"
				class="flex justify-center items-center w-full py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Sign in
			</button>
		</div>

	</form>
</template>
