import { stringify } from 'qs';
import { print } from 'graphql';

/**
 * Methods for interfacing with the Craft back end.
 */
const api = ({$axios}, $config, store) => {
	/**
	 * Utility to add default request config to requests, such as adding commonly used headers.
	 *
	 * @param {object} requestConfig - Custom request config to be merged with the default config.
	 * @returns merged request config.
	 */
	const withDefaultConfig = (requestConfig = {}) => {
		return {
			...requestConfig,
			withCredentials: true,
			headers: {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json',
				...requestConfig.headers,
			},
		};
	};

	/**
	 * For making GET requests to the Craft back end.
	 *
	 * @property {string} action - The Craft action URI.
	 * @property {object} config - Custom request configuration (such as headers).
	 */
	const get = async (action, config = {}) => {
		const { data } = await $axios.get(`/api${action}`, withDefaultConfig({ config }));
		return data;
	};

	/**
	 * For making POST requests to the Craft back end.
	 *
	 * @property {string} action   - The Craft action URI.
	 * @property {object} postData - The data to post.
	 * @property {object} config   - Custom request configuration (such as headers).
	 */
	const postAction = async (action, postData, config = {}) => {
		const data = {
			action,
			CRAFT_CSRF_TOKEN: await store.getters.getCsrfToken,
			...postData,
		};

		const response = await $axios.post(`/api`,
			stringify(data),
			withDefaultConfig(config),
		);

		return response.data;
	};

	/**
	 * All of the methods we are exporting from this file.
	 */
	return {
		get,
		postAction,
		/**
		 * For sending GQL queries to the Craft back end.
		 *
		 * @property {object} query     - The query to run.
		 * @property {object} variables - The variables to pass into the query.
		 * @property {object} params    - Any extra params to post with the request.
		 */
		graphqlQuery: async(query, variables, params) => {
			const data = {
				query: print(query),
				variables,
				params,
			};
			const response = await $axios.post(`/graphql`,
				data,
				withDefaultConfig({
					headers: {
						'Content-Type': 'application/json',
					},
				}),
			);
			return response.data;
		},
	};
};

/**
 * Injects the api method into Vue so it can be used globally throughout the app.
 * Example usage: this.$api.graphqlQuery([query], [vars], [params]);
 */
export default ({ app, $config, store }, inject) => {
	inject('api', api(app, $config, store));
};
