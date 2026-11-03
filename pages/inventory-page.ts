import type { Page } from '@playwright/test';
import { inventorySelectors } from '../selectors/inventory-selectors';

export class InventoryPage {
  readonly elements;

  constructor(page: Page) {
    const items = page.getByTestId(inventorySelectors.ITEM);
    const firstProduct = items.nth(0);
    const secondProduct = items.nth(1);
    const thirdProduct = items.nth(2);

    this.elements = {
      title: page.getByText(inventorySelectors.TITLE, { exact: true }),
      cartBadge: page.getByTestId(inventorySelectors.CART_BADGE),
      cartLink: page.getByTestId(inventorySelectors.CART_LINK),
      products: [
        {
          name: firstProduct.getByTestId(inventorySelectors.PRODUCT_NAME),
          price: firstProduct.getByTestId(inventorySelectors.PRICE),
          addButton: firstProduct.getByRole('button', { name: inventorySelectors.ADD_BUTTON, exact: true }),
          removeButton: firstProduct.getByRole('button', { name: inventorySelectors.REMOVE_BUTTON, exact: true }),
        },
        {
          name: secondProduct.getByTestId(inventorySelectors.PRODUCT_NAME),
          price: secondProduct.getByTestId(inventorySelectors.PRICE),
          addButton: secondProduct.getByRole('button', { name: inventorySelectors.ADD_BUTTON, exact: true }),
          removeButton: secondProduct.getByRole('button', { name: inventorySelectors.REMOVE_BUTTON, exact: true }),
        },
        {
          name: thirdProduct.getByTestId(inventorySelectors.PRODUCT_NAME),
          price: thirdProduct.getByTestId(inventorySelectors.PRICE),
          addButton: thirdProduct.getByRole('button', { name: inventorySelectors.ADD_BUTTON, exact: true }),
          removeButton: thirdProduct.getByRole('button', { name: inventorySelectors.REMOVE_BUTTON, exact: true }),
        },
      ],
    };
  }

  async openCart() {
    await this.elements.cartLink.click();
  }
}
