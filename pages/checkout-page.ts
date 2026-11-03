import type { Page } from '@playwright/test';
import { checkoutSelectors } from '../selectors/checkout-selectors';

// Dados, revisão e confirmação pertencem ao mesmo fluxo de checkout.
export class CheckoutPage {
  readonly elements;

  constructor(page: Page) {
    const items = page.getByTestId(checkoutSelectors.ITEM);

    this.elements = {
      firstName: page.getByPlaceholder(checkoutSelectors.FIRST_NAME),
      lastName: page.getByPlaceholder(checkoutSelectors.LAST_NAME),
      postalCode: page.getByPlaceholder(checkoutSelectors.POSTAL_CODE),
      continueButton: page.getByRole('button', { name: checkoutSelectors.CONTINUE_BUTTON, exact: true }),
      items,
      productName: (name: string) => items.filter({
        has: page.getByText(name, { exact: true }),
      }).getByTestId(checkoutSelectors.PRODUCT_NAME),
      subtotal: page.getByTestId(checkoutSelectors.SUBTOTAL),
      tax: page.getByTestId(checkoutSelectors.TAX),
      total: page.getByTestId(checkoutSelectors.TOTAL),
      finishButton: page.getByRole('button', { name: checkoutSelectors.FINISH_BUTTON, exact: true }),
      confirmation: page.getByRole('heading', { name: checkoutSelectors.CONFIRMATION, exact: true }),
      completeText: page.getByTestId(checkoutSelectors.COMPLETE_TEXT),
      cartBadge: page.getByTestId(checkoutSelectors.CART_BADGE),
    };
  }

  async fillInformation(customer: { firstName: string; lastName: string; postalCode: string }) {
    await this.elements.firstName.fill(customer.firstName);
    await this.elements.lastName.fill(customer.lastName);
    await this.elements.postalCode.fill(customer.postalCode);
    await this.elements.continueButton.click();
  }

  async finish() {
    await this.elements.finishButton.click();
  }
}
