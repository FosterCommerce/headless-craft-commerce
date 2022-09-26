<script>
	export default {
		name: "Index",
		/** Redirect users to the homepage if they hit this page */
		middleware({ redirect }) {
			return redirect('/');
		}
	}
</script>