/**
 * The main Vuex state for checkout.
 */
export const state = () => ({
	/**
	 * The steps for the checkout process.
	 */
	steps: [
		{
			label: 'Email',
			handle: 'email'
		},
		{
			label: 'Address',
			handle: 'address'
		},
		{
			label: 'Shipping',
			handle: 'shipping'
		},
		{
			label: 'Payment',
			handle: 'payment'
		}
	],
	/**
	 * The current step in the checkout process.
	 */
	currentStepNumber: 0,

	/**
	 * The countries available to select during checkout
	 */
	countries: {},
	/**
	 * The regions/states available to select during checkout
	 */
	regions: {},
	/**
	 * The payment gateways available to select during checkout
	 */
	gateways: {},
});

/**
 * Getters. These return properties of the state.
 */
export const getters = {
	/**
	 * Get all the steps.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 */
	getSteps(state) {
		return state.steps;
	},
	/**
	 * Get the current step number that the user is on.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 */
	getCurrentStepNumber(state) {
		return state.currentStepNumber;
	},
	/**
	 * Get the step object itself based ont he step number the user is on.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 */
	getCurrentStep(state) {
		return state.steps[state.currentStepNumber];
	},
	/**
	 * Get the previous step, if there is one.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 */
	getPreviousStep(state) {
		return state.steps[state.currentStepNumber - 1] ?? state.steps[state.currentStepNumber];
	},
	/**
	 * Get the next step, if there is one.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 */
	getNextStep(state) {
		return state.steps[state.currentStepNumber + 1] ?? state.steps[state.currentStepNumber];
	},
	/**
	 * Get the total number of steps.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 */
	getTotalSteps(state) {
		return state.steps.length;
	},
	/**
	 * Whether or not the current step is the first one.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 */
	getIsFirstStep(state) {
		return state.currentStepNumber === 0;
	},
	/**
	 * Whether or not the current step is the last one.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 */
	getIsLastStep(state) {
		return state.currentStepNumber === (state.steps.length - 1);
	},
	/**
	 * Gets the countries available during checkout
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 */
	getCountries(state) {
		return state.countries;
	},
	/**
	 * Gets the regions/states available during checkout
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 */
	getRegions(state) {
		return state.regions;
	},
	/**
	 * Gets the payment gateways available during checkout
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 */
	getGateways(state) {
		return state.gateways;
	}
};

/**
 * Mutations. These set/modify properties of the state.
 */
export const mutations = {
	/**
	 * Set the steps.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 *
	 * @property {array} payload - An array fo step objects.
	 */
	setSteps(state, payload) {
		state.steps = payload;
	},
	/**
	 * Set the current step number.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 *
	 * @property {number} payload - The step number to set.
	 */
	setCurrentStepNumber(state, payload) {
		state.currentStepNumber = payload;
	},
	/**
	 * Set the stores configured countries.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 *
	 * @property {object} payload - An object with key value pairs of the country code and name
	 */
	setCountries(state, payload) {
		state.countries = payload;
	},
	/**
	 * Set the stores configured regions.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 *
	 * @property {object} payload - An object with key value pairs of the country code, and regions
	 */
	setRegions(state, payload) {
		state.regions = payload;
	},
	/**
	 * Set the stores configured gateways.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 *
	 * @property {object} payload - An object with key value pairs of the payment gateways
	 */
	setGateways(state, payload) {
		state.gateways = payload;
	}
};

/**
 * Actions. These run the mutations which set the properties of the state.
 */
export const actions = {
	/**
	 * Initializes the steps and modifies them if a user is already logged in
	 *
	 * @property {function} commit  - Vuex commit method.
	 * @property {object} getters - Vuex getters method.
	 * @property {boolean} isGuest - If the user is logged in
	 */
	fetchSteps({ commit, getters }, isGuest) {
		if (!isGuest) {
			const steps = [];
			getters.getSteps.forEach((step) => {
				if (step.handle !== 'email') {
					steps.push(step);
				}
			});
			commit('setSteps', steps);
		}
	},
	/**
	 * Decrement the current step number.
	 *
	 * @property {function} commit  - Vuex commit method.
	 * @property {object}   getters - Vuex getters method.
	 */
	decrementStep({ commit, getters }) {
		if (!getters.getIsFirstStep) {
			commit('setCurrentStepNumber', (getters.getCurrentStepNumber - 1));
		}
	},
	/**
	 * Increment the current step number.
	 *
	 * @property {function} commit  - Vuex commit method.
	 * @property {object} getters - Vuex getters object.
	 */
	incrementStep({ commit, getters }) {
		if (!getters.getIsLastStep) {
			commit('setCurrentStepNumber', (getters.getCurrentStepNumber + 1));
		}
	},
	/**
	 * Sets the current step to the first step.
	 *
	 * @property {function} commit  - Vuex commit method.
	 */
	goToFirstStep({ commit }) {
		commit('setCurrentStepNumber', 0);
	},
	/**
	 * Sets the current step to the last step.
	 *
	 * @property {function} commit  - Vuex commit method.
	 */
	gotToLastStep({ commit, getters }) {
		commit('setCurrentStepNumber', (getters.getTotalSteps - 1));
	},
	/**
	 * Fetches the countries configured in the Commerce store and sets them into state
	 *
	 * @property {function} commit  - Vuex commit method.
	 */
	async fetchCountries({ commit }) {
		const { countries } =  await this.$api.get('/actions/fc/critical-data/get-store-countries');
		commit('setCountries', countries);
	},
	/**
	 * Fetches the regions/states configured in the Commerce store and sets them into state
	 *
	 * @property {function} commit  - Vuex commit method.
	 */
	async fetchRegions({ commit }) {
		const { regions } =  await this.$api.get('/actions/fc/critical-data/get-store-regions');
		commit('setRegions', regions);
	},
	/**
	 * Fetches the enabled gateways configured in the Commerce store and sets them into state
	 *
	 * @property {function} commit  - Vuex commit method.
	 */
	async fetchGateways({ commit }) {
		const { gateways } = await this.$api.get('/actions/fc/critical-data/get-store-payment-gateways');
		commit('setGateways', gateways);
	}
};
