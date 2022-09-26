<?php

namespace modules\fc\services;

use Craft;
use craft\base\Component;
use craft\commerce\Plugin;
use craft\services\Security;

class CriticalDataService extends Component {

	/**
	 * Get the countries enabled in Commerce
	 *
	 * @return array
	 */
    public function getStoreCountries(): array {
        return Plugin::getInstance()->getStore()->getStore()->getCountriesList();
    }

	/**
	 * Get the country regions enabled in Commerce
	 *
	 * @return array
	 */
    public function getStoreRegions(): array {
        return Plugin::getInstance()->getStore()->getStore()->getAdministrativeAreasListByCountryCode();
    }

	/**
	 * Get the enabled payment gateways in Commerce
	 *
	 * @return array
	 */
    public function getStorePaymentGateways(): array {
        $gateways = Plugin::getInstance()->gateways->getAllCustomerEnabledGateways();
        $result   = [];

        foreach ($gateways as $gateway) {
            $newGateway = [];

            foreach ($gateway as $k => $v) {
                if (preg_match('/^\$[A-Z0-9_]/', $v)) {
                    $v = getenv(str_replace('$', '', $v));
                }

                if ($k === 'handle' && $v === 'paypal') {
                    $newGateway['redirect']  = Craft::$app->getSecurity()->hashData('/order?number={number}');
                    $newGateway['cancelUrl'] = Craft::$app->getSecurity()->hashData('/checkout');
                }

                $newGateway[$k] = $v;
            }

            $result[] = $newGateway;
        }

    	return $result;
	}
}
