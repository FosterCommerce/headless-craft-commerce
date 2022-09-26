/**
 * The main Vuex state.
 */
export const state = () => ({
	primaryNav: [],
	csrfToken: "",
});

/**
 * Getters. These return properties of the state.
 */
export const getters = {
	/**
	 * Returns the primary navigation link elements from the EntrySettings results.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 */
	getPrimaryNav(state) {
		const linkArr = [];

		state.primaryNav.forEach((obj) => {
			const linkObj = {
				target: obj.navLink.target ?? '_self',
				type: obj.navLink.type === 'entry' ? 'internal' : 'external',
			}

			if(obj.navLink.type === 'entry' && obj.navLink.element) {
				linkObj.label = obj.navLink.customText ?? obj.navLink.element.title;
				linkObj.url = '/' + obj.navLink.element.uri;
			} else {
				linkObj.label = obj.navLink.customText;
				linkObj.url = obj.navLink.url;
			}

			linkArr.push(linkObj);
		});

		return linkArr;
	},
	/**
	 *Get the Craft CSRF token from the state.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 */
	getCsrfToken(state) {
		return state.csrfToken;
	},
};

/**
 * Mutations. These set/modify properties of the state.
 */
export const mutations = {
	/**
	 * Set the primary nav for the site.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 *
	 * @property {object} payload - The primary nav array.
	 */
	setPrimaryNav(state, payload) {
		state.primaryNav = payload;
	},
	/**
	 * Set the Craft CSRF token.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 *
	 * @property {string} payload - The CSRF token from Craft.
	 */
	setCsrfToken(state, payload) {
		state.csrfToken = payload;
	},
};

/**
 * Actions. These run the mutations which set the properties of the state.
 */
export const actions = {
	/**
	 * Server Init Action. Used to fetch global and layout-level data.
	 * On static generated sites, it runs for every page during generate.
	 *
	 * @param {function} commit - Vuex commit method.
	 */
	async nuxtServerInit({ commit, dispatch }) {
		// Fetch the settings entry to get the sites global navigation
		const query = await import('@/queries/EntrySettings.gql').then((module) => module.default);
		const { data: queryData } = await this.$api.graphqlQuery(query);
		commit('setPrimaryNav', queryData.entry.primaryNavigation);

		await dispatch('checkout/fetchCountries');
		await dispatch('checkout/fetchRegions');
		await dispatch('checkout/fetchGateways');
	}
};
