<?php

namespace modules\fc\controllers;

use Craft;
use craft\web\Controller;

use yii\web\Response;

use modules\fc\Fc;

class CriticalDataController extends Controller
{
    protected array|bool|int $allowAnonymous = [ 'get-store-countries', 'get-store-regions', 'get-store-payment-gateways' ];

	/**
	 * Get the countries enabled in Commerce
	 *
	 * @return Response
	 */
    public function actionGetStoreCountries() : Response {
		$this->requireAcceptsJson();

        $response = [
            'success' => true,
            'countries' => []
        ];

        $response['countries'] = Fc::getInstance()->critical->getStoreCountries();

        return $this->asJson($response);
    }

	/**
	 * Get the country regions enabled in Commerce
	 *
	 * @return Response
	 */
    public function actionGetStoreRegions() : Response {
		$this->requireAcceptsJson();

        $response = [
            'success' => true,
            'regions' => []
        ];

        $response['regions'] = Fc::getInstance()->critical->getStoreRegions();

        return $this->asJson($response);
    }

	/**
	 * Get the enabled payment gateways in Commerce
	 *
	 * @return Response
	 */
    public function actionGetStorePaymentGateways() : Response {
		$this->requireAcceptsJson();

		$response = [
			'success' => true,
			'gateways' => []
		];

		$response['gateways'] = Fc::getInstance()->critical->getStorePaymentGateways();

		return $this->asJson($response);
	}
}
