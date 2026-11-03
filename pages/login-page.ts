import type { Page } from '@playwright/test';
import { loginSelectors } from '../selectors/login-selectors';

export class LoginPage {
  private readonly elements;

  constructor(private readonly page: Page) {
    this.elements = {
      username: page.getByTestId(loginSelectors.USERNAME),
      password: page.getByTestId(loginSelectors.PASSWORD),
      loginButton: page.getByTestId(loginSelectors.LOGIN_BUTTON),
    };
  }

  async open() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.elements.username.fill(username);
    await this.elements.password.fill(password);
    await this.elements.loginButton.click();
  }
}
