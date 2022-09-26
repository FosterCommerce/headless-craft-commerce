<?php

namespace modules\fc\controllers;

use Craft;
use craft\commerce\models\PaymentCurrency;
use craft\web\Controller;
use craft\commerce\Plugin as Commerce;

class PaymentsController extends Controller {
    protected array|bool|int $allowAnonymous = [ 'get-form-html' ];

    public function actionGetFormHtml() {
        $this->requireAcceptsJson();
        $gatewayId = (int)Craft::$app->request->getQueryParam('id');

        if ($gatewayId) {
            $cart = Commerce::getInstance()->getCarts()->getCart();

            $cart->gatewayId = $gatewayId;

            return $cart->gateway->getPaymentFormHtml([
                'currency' => $cart->paymentCurrency
            ]);
        }
    }
}
