import Addresses from '@/queries/Addresses.gql';

/**
 * The main Vuex state for the cart.
 */
export const state = () => ({
  /**
   * Whether or not the app is loading.
   */
  loading: true,
  /**
   * The cart properties.
   */
  currentCart: {

  	email: '',

		shippingAddressId: null,

		sourceShippingAddressId: null,

	  shippingMethodHandle: null,

	  availableShippingMethodOptions: {},

		billingAddressId: null,

		sourceBillingAddressId: null,

    /**
     * Applied coupon code (if any).
     */
    couponCode: null,
    /**
     * Subtotal of all items in the cart.
     */
    itemSubtotalAsCurrency: '$0.00',
    /**
     * Taxes.
     */
    totalTaxAsCurrency: '$0.00',
    /**
     * Discount, iff applicable.
     */
    totalDiscountAsCurrency: '$0.00',
    /**
     * Shipping cost for the order.
     */
    totalShippingCostAsCurrency: '$0.00',
    /**
     * Total for everything (subtotal + tax - discount + shipping).
     */
    totalAsCurrency: '$0.00',
    /**
     * Unique identifier for the cart in Craft.
     */
    number: null,
		/**
		 * Line items in the cart
		 */
		lineItems: [],
  },

	addresses: [],

  /**
   * Errors, if any.
   */
  cartErrors: [],
});

/**
 * Getters. These return properties of the state.
 */
export const getters = {
  /**
   * Get the current cart.
   *
   * NOTE: The `state` property is pulled in automatically.
   */
  getCurrentCart(state) {
    return state.currentCart;
  },

	getShippingAddress(state) {
  	const shippingAddresses = state.addresses.filter((address) => {
  		return address.title === 'Shipping Address';
		});
  	return shippingAddresses.length ? shippingAddresses[0] : null;
	},

	getBillingAddress(state) {
		const billingAddresses = state.addresses.filter((address) => {
			return address.title === 'Billing Address';
		});
		return billingAddresses.length ? billingAddresses[0] : null;
	},

	/**
	 * Get all items in the cart.
	 *
	 * NOTE: The `state` property is pulled in automatically.
	 */
	getItems(state) {
		return state.currentCart.lineItems;
	},

	getEmail(state) {
		return state.currentCart.email;
	},

	getShippingAddressId(state) {
		return state.currentCart.shippingAddressId;
	},

	getSourceShippingAddressId(state) {
		return state.currentCart.sourceShippingAddressId;
	},

	getShippingMethodHandle(state) {
		return state.currentCart.shippingMethodHandle;
	},

	getAvailableShippingMethodOptions(state) {
		return state.currentCart.availableShippingMethodOptions;
	},

	getBillingAddressId(state) {
		return state.currentCart.billingAddressId;
	},

	getSourceBillingAddressId(state) {
		return state.currentCart.sourceBillingAddressId;
	},

	getBillingSameAsShipping(state, getters) {
		// We get this value by comparing the two addresses in the cart as after the cart is fetched,
		// the 'billingSameAsShipping' value in the cart does not persist and the shippingAddressId
		// will be different from the billingAddressId as addresses are cloned over.
		let isMatch = false;

		if (getters.getShippingAddress && getters.getBillingAddress) {
			const shipping = getters.getShippingAddress;
			const billing = getters.getBillingAddress;

			if (
				billing.fullName === shipping.fullName &&
				billing.addressLine1 === shipping.addressLine1 &&
				billing.addressLine2 === shipping.addressLine2 &&
				billing.organization === shipping.organization &&
				billing.locality === shipping.locality &&
				billing.countryCode === shipping.countryCode &&
				billing.postalCode === shipping.postalCode &&
				billing.phone === shipping.phone
			) {
				isMatch = true
			}
		}

		return isMatch;
	},

  /**
   * Get the loading status.
   *
   * NOTE: The `state` property is pulled in automatically.
   */
  getLoading(state) {
    return state.loading;
  },

  /**
   * Get Cart errors.
   *
   * NOTE: The `state` property is pulled in automatically.
   */
  getCartErrors(state) {
    return state.cartErrors;
  },
};

/**
 * Mutations. These set/modify properties of the state.
 */
export const mutations = {
  /**
   * Set the current cart.
   *
   * NOTE: The `state` property is pulled in automatically.
   *
   * @property {object} payload - The cart object to set int he state.
   */
  setCurrentCart(state, payload) {
    state.currentCart = payload;
  },

	setAddresses(state, payload) {
  	state.addresses = payload;
	},

  /**
   * Set the loading state.
   *
   * NOTE: The `state` property is pulled in automatically.
   *
   * @property {boolean} payload - Whether or not the app is loading.
   */
  setLoading(state, payload) {
    state.loading = payload;
  },

  /**
   * Set the cart error.
   *
   * NOTE: The `state` property is pulled in automatically.
   *
   * @property {object} payload - Array of errors to set in the cart.
   */
  setCartErrors(state, payload) {
    state.cartErrors = payload;
  },
};

/**
 * Actions. These run the mutations which set the properties of the state.
 */
export const actions = {
	/**
	 * Fetches the cart data from Craft/Commerce and places it into state.
	 *
	 * @property {function} commit   - Vuex commit method.
	 */
	async fetchCart({ commit, dispatch }) {
		// Get the cart from commerce and set it into state
		const { cart } = await this.$api.get('/actions/fc/cart/get-cart');
		commit('setCurrentCart', cart);
		await dispatch('fetchAddresses', cart.id);
		commit('setLoading', false);
	},

	async fetchAddresses({ commit }, cartId) {
		const { data } = await this.$api.graphqlQuery(
			Addresses,
			{
				ownerId: cartId
			}
		);
		commit('setAddresses', data.addresses);
	},

  /**
   * Add a new item to the cart (to modify quantity, use setItemQty).
   *
   * @property {function} dispatch - Vuex dispatch method.
   * @property {function} commit   - Vuex commit method.
   * @property {object}   item     - The purchasable item to add to the cart.
   */
  async addNewItem({ commit, dispatch }, item) {
    try {
    		const { cart } = await this.$api.postAction('/fc/cart/update-cart', {
					purchasableId: item.id,
					qty: item.qty,
				});

       const errorNotices = handleNotices({ commit, dispatch }, cart.notices);

       if (errorNotices.length < 1) {
         commit('setCurrentCart', cart);
       }
    } catch (error) {
      handleError(commit, error);
    }
  },
	/**
	 * Set the quantity of a line item.
	 *
	 * @property {function} dispatch - Vuex dispatch method.
	 * @property {function} commit   - Vuex commit method.
	 * @property {object}   item     - The line item to set the quantity for.
	 */
	async setItemQty({ dispatch, commit }, item) {
		try {
			const { cart } = await this.$api.postAction('/fc/cart/update-cart', {
				lineItems: {
					[Number(item.id)]: {
						qty: Number(item.qty)
					}
				}
			});

			const errorNotices = handleNotices({ commit, dispatch }, cart.notices);

			if (errorNotices.length < 1) {
				if (item.qty === 0) {
					return dispatch('removeItem', item);
				}
				commit('setCurrentCart', cart);
				return true;
			}
		} catch (error) {
			handleError(commit, error);
			return false;
		}
	},
  /**
   * Remove a line item entirely from the cart.
   *
   * @property {function} dispatch - Vuex dispatch method.
   * @property {function} commit   - Vuex commit method.
   * @property {object}   item     - The line item to remove from the cart.
   */
  async removeItem({ commit, dispatch }, item) {
    try {
    	const { cart } = await this.$api.postAction('/fc/cart/update-cart', {
				lineItems: {
					[Number(item.id)]: {
						remove: true
					}},
			});

    	const errorNotices = handleNotices({ commit, dispatch }, cart.notices);

			if (errorNotices.length < 1) {
				commit('setCurrentCart', cart);
			}
    } catch (error) {
       handleError(commit, error);
    }
  },

	/**
	 * Saves the email address
	 *
	 * @property {function} dispatch - Vuex dispatch method.
	 * @property {function} commit   - Vuex commit method.
	 * @property {string}  email  - An email address string
	 */
	async saveEmail({ commit, dispatch }, email) {
		try {
			const { cart } = await this.$api.postAction('/fc/cart/update-cart', { email });
			const errorNotices = handleNotices({ commit, dispatch }, cart.notices);

			if (errorNotices.length < 1) {
				commit('setCurrentCart', cart);
			}
		} catch (error) {
			handleError(commit, error);
		}
	},

	async saveShippingAddress({ commit, dispatch }, shippingAddress) {
		const params = {
			shippingAddressId: shippingAddress.id,
			shippingAddress,
			billingAddressSameAsShipping: 1
		};
		try {
			const { cart } = await this.$api.postAction('/fc/cart/update-cart', params);
			const errorNotices = handleNotices({ commit, dispatch }, cart.notices);

			if (errorNotices.length < 1) {
				commit('setCurrentCart', cart);
				await dispatch('fetchAddresses', cart.id);
			}
		} catch (error) {
			handleError(commit, error);
		}
	},

	async saveShippingMethod({ commit, dispatch }, shippingMethodHandle) {
		try {
			const { cart } = await this.$api.postAction('/fc/cart/update-cart', { shippingMethodHandle });
			const errorNotices = handleNotices({ commit, dispatch }, cart.notices);

			if (errorNotices.length < 1) {
				commit('setCurrentCart', cart);
			}
		} catch (error) {
			handleError(commit, error);
		}
	},

	async saveBillingSameAsShipping({ commit, dispatch }, billingSameAsShipping) {
		try {
			const { cart } = await this.$api.postAction('/fc/cart/update-cart', { billingAddressSameAsShipping: billingSameAsShipping });
			const errorNotices = handleNotices({ commit, dispatch }, cart.notices);

			if (errorNotices.length < 1) {
				commit('setCurrentCart', cart);
			}
		} catch (error) {
			handleError(commit, error);
		}
	},

	async saveBillingAddress({ commit, dispatch }, billingAddress) {
		const params = {
			billingAddressId: billingAddress.id,
			billingAddress
		};
		try {
			const { cart } = await this.$api.postAction('/fc/cart/update-cart', params);
			const errorNotices = handleNotices({ commit, dispatch }, cart.notices);

			if (errorNotices.length < 1) {
				commit('setCurrentCart', cart);
				await dispatch('fetchAddresses', cart.id);
			}
		} catch (error) {
			handleError(commit, error);
		}
	},

  /**
   * Apply coupon.
   *
   * @property {function} dispatch - Vuex dispatch method.
   * @property {function} commit   - Vuex commit method.
   * @property {string} couponCode - The coupon code to apply to the cart.
   */
  async applyCoupon({ dispatch, commit }, couponCode) {
    try {
      const { cart } = await this.$api.postAction('/fc/cart/update-cart',{
				couponCode
			});

      const errorNotices = handleNotices({ commit, dispatch }, cart.notices);

      if (errorNotices.length < 1) {
        commit('setCurrentCart', cart);
        return true;
      }
    } catch (error) {
      handleError(commit, error);
      return false;
    }
  },
	/**
	 * Used to display notices manually
	 * @param commit
	 * @param dispatch
	 * @param notice
	 */
	displayNotice({ commit, dispatch }, notice) {
  	handleNotices({ commit, dispatch }, [{ message: notice }]);
	},

  /**
   * Clear Cart notices.
   *
   * @property {function} commit - Vuex commit method.
   */
  async clearNotices({ commit }) {
  	const { cart } = await this.$api.postAction('/fc/cart/update-cart', {
			clearNotices: 'clearNotices'
		});
    commit('setCurrentCart', cart);
  },
};

/**
 * Sets cart notices and errors.
 *
 * @property {function} dispatch - Vuex dispatch method.
 * @property {function} commit   - Vuex commit method.
 * @property {object}   notices  - Array of notices for the cart.
 */
const handleNotices = ({ commit, dispatch }, notices) => {
  let errors = [];

  notices.forEach(notice => {
    errors = [...errors, notice.message];
  });

  commit('setCartErrors', errors);

  // Remove the errors after 6 seconds.
  setTimeout(() => {
    dispatch('clearNotices');
    commit('setCartErrors', []);
  }, 6000);

  return errors;
};

/**
 * Handles errors that come back from the API.
 *
 * @property {function} commit - Vuex commit method.
 * @property {object}   error  - The error object from the server.
 */
const handleError = (commit, error) => {
  let errors = [];

  if (error.response.status === 400) {
    const cartErrors = Object.values(error.response.data.errors);

    cartErrors.forEach(parentErrors => {
      parentErrors.forEach(error => {
        errors = [...errors, error];
      });
    });

    commit('setCartErrors', errors);

    // Remove the errors after 6 seconds.
    setTimeout(() => {
      commit('setCartErrors', []);
    }, 6000);
  } else {
    commit('setCartErrors', [
      "Your request could not be completed at the moment. Please try again.",
    ]);

    // Remove the errors after 6 seconds.
    setTimeout(() => {
      commit('setCartErrors', []);
    }, 6000);
  }

  return {
    success: false,
    error,
  };
};
