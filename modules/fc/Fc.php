<?php

namespace modules\fc;

use craft\events\ElementEvent;
use craft\helpers\ElementHelper;
use craft\services\Elements;
use yii\base\Event;
use yii\base\Module;

use Craft;

use craft\web\UrlManager;
use craft\events\RegisterUrlRulesEvent;
use craft\web\twig\variables\CraftVariable;

use modules\ew\variables\FcVariable;

class Fc extends Module
{
	public static Fc $instance;

	public function __construct($id, $parent = null, $config = []) {
        Craft::setAlias('@modules/fc', __DIR__);

        // Set the controllerNamespace based on whether this is a console or web request
        if (Craft::$app->getRequest()->getIsConsoleRequest()) {
            $this->controllerNamespace = 'modules\\fc\\console\\controllers';
        } else {
            $this->controllerNamespace = 'modules\\fc\\controllers';
        }

        // Set this as the global instance of this module class
        static::setInstance($this);
        parent::__construct($id, $parent, $config);
    }

    public function init() {
        parent::init();
        self::$instance = $this;

		$this->setComponents([
            'critical' => \modules\fc\services\CriticalDataService::class,
		]);

        // Register our site routes
        Event::on(
            UrlManager::class,
            UrlManager::EVENT_REGISTER_SITE_URL_RULES,
            function (RegisterUrlRulesEvent $event) {
                $event->rules['api/get-critical'] = 'fc/critical-data/get-csrf-token';
                $event->rules['api/get-store-countries'] = 'fc/critical-data/get-store-countries';
				$event->rules['api/get-store-regions'] = 'fc/critical-data/get-store-regions';
				$event->rules['api/get-store-payment-gateways'] = 'fc/critical-data/get-store-payment-gateways';
				$event->rules['api/get-form-html'] = 'fc/payments/get-form-html';
            }
        );

		 // Register our variables
		 Event::on(
            CraftVariable::class,
            CraftVariable::EVENT_INIT,
            function (Event $event) {
                /** @var CraftVariable $variable */
                $variable = $event->sender;
                $variable->set('fc', FcVariable::class);
            }
        );

		// Prevent the search index from getting updated for drafts
		Event::on(
			Elements::class,
			Elements::EVENT_BEFORE_UPDATE_SEARCH_INDEX,
			function (ElementEvent $event) {
				if (ElementHelper::isDraft($event->element)) {
					$event->isValid = false;
				}
			}
		);
    }
}
