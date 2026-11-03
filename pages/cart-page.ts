import type { Page } from '@playwright/test';
import { cartSelectors } from '../selectors/cart-selectors';

export class CartPage {
  readonly elements;

  constructor(page: Page) {
    const items = page.getByTestId(cartSelectors.ITEM);
    const item = (name: string) => items.filter({
      has: page.getByText(name, { exact: true }),
    });

    this.elements = {
      items,
      price: (name: string) => item(name).getByTestId(cartSelectors.PRICE),
      quantity: (name: string) => item(name).getByTestId(cartSelectors.QUANTITY),
      checkoutButton: page.getByRole('button', { name: cartSelectors.CHECKOUT_BUTTON, exact: true }),
    };
  }

  async checkout() {
    await this.elements.checkoutButton.click();
  }
}
