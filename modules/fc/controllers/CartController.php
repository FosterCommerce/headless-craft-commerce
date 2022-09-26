<?php

namespace modules\fc\controllers;

use Craft;
use craft\commerce;
use craft\commerce\elements\Variant;
use craft\commerce\elements\Order;
use craft\commerce\controllers\CartController as Commerce_CartController;
use yii\base\InvalidConfigException;
use yii\web\Response;

class CartController extends Commerce_CartController
{

	protected array|bool|int $allowAnonymous = [
		'get-cart',
		'load-cart',
		'update-cart',
		'complete',
		'get-order-by-number'
	];

	/**
	 * Get a completed order based on the order number
	 *
	 * @return Response
	 */
	public function actionGetOrderByNumber(): Response {
		$this->requireAcceptsJson();

		$number = $this->request->getParam('number');

		$response = [
			'success' => true,
			'order' => []
		];

		$order = commerce\Plugin::getInstance()->orders->getOrderByNumber($number);

		if ($order) {
			$response['order'] = $order->toArray();
			$response['order']['lineItems'] = $this->formatLineItems($order);
			$response['order']['pdfUrl'] = $order->pdfUrl;
		} else {
			$response['order'] = null;
		}

		return $this->asJson($response);
	}

	/**
	 * Override the Commerce cartArray method so we can add custom field data to line items
	 *
	 * @param Order $cart
	 * @return array
	 */
	protected function cartArray(Order $cart): array
	{
		$data = parent::cartArray($cart);

		// Replace the current cart line items with the ones we have formatted to get the line item fields
		$data['lineItems'] = $this->formatLineItems($cart);

		return $data;
	}

	/**
	 * Format Commerce cart/order line item data to get custom field values
	 *
	 * @param Order $cart
	 * @return array
	 * @throws InvalidConfigException
	 */
	protected function formatLineItems(Order $cart): array {
		// Create a line items array and loop through the line items in the cart to populate it
		// So we can fetch the line item product and variant fields
		$lineItems = [];
		foreach ($cart->lineItems as $lineItem) {
			// Replicate all the current data we get from line items
			$lineItemData['adjustments'] = $lineItem->adjustments;
			$lineItemData['adjustmentsTotalAsCurrency'] = $lineItem->adjustmentsTotalAsCurrency;
			$lineItemData['dateCreated'] = $lineItem->dateCreated;
			$lineItemData['dateUpdated'] = $lineItem->dateUpdated;
			$lineItemData['description'] = $lineItem->getDescription();
			$lineItemData['discountAsCurrency'] = $lineItem->discountAsCurrency;
			$lineItemData['height'] = $lineItem->height;
			$lineItemData['id'] = $lineItem->id;
			$lineItemData['length'] = $lineItem->length;
			$lineItemData['lineItemStatusId'] = $lineItem->lineItemStatusId;
			$lineItemData['note'] = $lineItem->note;
			$lineItemData['onSale'] = $lineItem->onSale;
			$lineItemData['options'] = $lineItem->options;
			$lineItemData['optionsSignature'] = $lineItem->optionsSignature;
			$lineItemData['orderId'] = $lineItem->orderId;
			$lineItemData['price'] = $lineItem->price;
			$lineItemData['priceAsCurrency'] = $lineItem->priceAsCurrency;
			$lineItemData['privateNote'] = $lineItem->privateNote;
			$lineItemData['purchasableId'] = $lineItem->purchasableId;
			$lineItemData['qty'] = $lineItem->qty;
			$lineItemData['saleAmount'] = $lineItem->saleAmount;
			$lineItemData['saleAmountAsCurrency'] = $lineItem->saleAmountAsCurrency;
			$lineItemData['salePrice'] = $lineItem->salePrice;
			$lineItemData['salePriceAsCurrency'] = $lineItem->salePriceAsCurrency;
			$lineItemData['shippingCategoryId'] = $lineItem->shippingCategoryId;
			$lineItemData['shippingCost'] = $lineItem->shippingCost;
			$lineItemData['shippingCostAsCurrency'] = $lineItem->shippingCostAsCurrency;
			$lineItemData['sku'] = $lineItem->getSku();
			$lineItemData['subtotal'] = $lineItem->subtotal;
			$lineItemData['subtotalAsCurrency'] = $lineItem->subtotalAsCurrency;
			$lineItemData['tax'] = $lineItem->tax;
			$lineItemData['taxAsCurrency'] = $lineItem->taxAsCurrency;
			$lineItemData['taxCategoryId'] = $lineItem->taxCategoryId;
			$lineItemData['taxIncluded'] = $lineItem->taxIncluded;
			$lineItemData['taxIncludedAsCurrency'] = $lineItem->taxIncludedAsCurrency;
			$lineItemData['total'] = $lineItem->total;
			$lineItemData['totalAsCurrency'] = $lineItem->totalAsCurrency;
			$lineItemData['uid'] = $lineItem->uid;
			$lineItemData['weight'] = $lineItem->weight;
			$lineItemData['width'] = $lineItem->width;

			// Get the purchasable (variant) of the line item, its parent product, and the variants image
			$variant = Variant::find()->id($lineItem->purchasableId)->one();
			$product = $variant->getProduct();
			$image = $variant->image->one();

			// Add the custom field values that we need from the variant
			$lineItemData['color'] = $variant->color->value;
			$lineItemData['size'] = $variant->size->value;
			$lineItemData['image'] = [
				'alt' => $image->alt,
				'extension' => $image->extension,
				'filename' => $image->filename,
				'focalPoint' => $image->focalPoint,
				'hasFocalPoint' => $image->hasFocalPoint,
				'height' => $image->height,
				'uri' => $image->uri,
				'url' => $image->url,
				'width' => $image->width
			];

			// Add the values from the product
			$lineItemData['title'] = $product->title;
			$lineItemData['previewText'] = $product->previewText;
			$lineItemData['uri'] = $product->uri;
			$lineItemData['url'] = $product->url;
			$lineItemData['slug'] = $product->slug;

			// Push it to our line items array
			$lineItems[] = $lineItemData;
		}

		return $lineItems;
	}
}
