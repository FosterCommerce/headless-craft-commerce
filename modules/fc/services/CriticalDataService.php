<?php

namespace modules\fc\services;

use Craft;
use craft\base\Component;
use craft\commerce\Plugin;
use craft\services\Security;

class CriticalDataService extends Component
{

	/**
	 * Get the countries enabled in Commerce
	 *
	 * @return array
	 */
	public function getStoreCountries(): array
	{
		return Plugin::getInstance()->getStore()->getStore()->getCountriesList();
	}

	/**
	 * Get the country regions enabled in Commerce
	 *
	 * @return array
	 */
	public function getStoreRegions(): array
	{
		return Plugin::getInstance()->getStore()->getStore()->getAdministrativeAreasListByCountryCode();
	}

	/**
	 * Get the enabled payment gateways in Commerce
	 *
	 * @return array
	 */
	public function getStorePaymentGateways(): array
	{
		$gateways = Plugin::getInstance()->gateways->getAllCustomerEnabledGateways();

		$gatewayData = [];
		foreach ($gateways as $gateway) {
			$g = [];
			$g['handle'] = $gateway->handle;
			$g['id'] = $gateway->id;
			$g['name'] = $gateway->name;
			$g['redirect'] = Craft::$app->getSecurity()->hashData('/order?number={number}');
			$g['cancelUrl'] = Craft::$app->getSecurity()->hashData('/checkout');
			$gatewayData[] = $g;

		}

		return $gatewayData;
	}
}
