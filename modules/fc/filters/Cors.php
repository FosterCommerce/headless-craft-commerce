<?php

namespace modules\fc\filters;

use Craft;

class Cors extends \yii\filters\Cors
{

    /**
     * prepareHeaders
     *
     * @param mixed $requestHeaders 
     *
     * @return void
     */
    public function prepareHeaders($requestHeaders)
    {

        if (Craft::$app->request->isConsoleRequest) {

            try {

                return parent::prepareHeaders($requestHeaders);
            } catch (\Exception $E) {
                return true;
            }
        } else {

            return parent::prepareHeaders($requestHeaders);
        }
    }

    /**
     * beforeAction
     *
     * @param mixed $action 
     *
     * @return void
     */
    public function beforeAction($action)
    {

        if (Craft::$app->request->isConsoleRequest) {

            try {

                return parent::beforeAction($action);
            } catch (\Exception $E) {
                return true;
            }
        } else {

            return parent::beforeAction($action);
        }
    }
}
