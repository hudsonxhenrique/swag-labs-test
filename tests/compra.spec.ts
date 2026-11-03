import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { InventoryPage } from '../pages/inventory-page';
import { CartPage } from '../pages/cart-page';
import { CheckoutPage } from '../pages/checkout-page';

test('Compra bem-sucedida (Usuário padrão)', async ({ page }) => {

  const login = new LoginPage(page);
  const inventory = new InventoryPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  const usuario = { username: 'standard_user', password: 'secret_sauce' };
  const comprador = { firstName: 'Teste', lastName: 'Silva', postalCode: '35500-000' };
  const quantidadeProdutos = 3;

  const produtos: { nome: string; preco: string }[] = [];

  await test.step('Entrar com o usuário padrão', async () => {
    await login.open();
    await login.login(usuario.username, usuario.password);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventory.elements.title).toBeVisible();
  });

  await test.step('Adicionar os três primeiros produtos exibidos', async () => {
    for (const produto of inventory.elements.products) {
      produtos.push({
        nome: await produto.name.innerText(),
        preco: await produto.price.innerText(),
      });
      await produto.addButton.click();
    }

    expect(produtos).toHaveLength(quantidadeProdutos);
    for (const produto of inventory.elements.products) {
      await expect(produto.removeButton).toBeVisible();
    }
    await expect(inventory.elements.cartBadge).toHaveText(String(quantidadeProdutos));
  });

  await test.step('Conferir os produtos no carrinho', async () => {
    await inventory.openCart();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cart.elements.items).toHaveCount(quantidadeProdutos);
    for (const produto of produtos) {
      await expect(cart.elements.price(produto.nome)).toHaveText(produto.preco);
      await expect(cart.elements.quantity(produto.nome)).toHaveText('1');
    }
  });

  await test.step('Informar dados e validar a revisão da compra', async () => {
    await cart.checkout();
    await checkout.fillInformation(comprador);

    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(checkout.elements.items).toHaveCount(quantidadeProdutos);
    for (const produto of produtos) {
      await expect(checkout.elements.productName(produto.nome)).toHaveText(produto.nome);
    }
    const subtotalCentavos = produtos.reduce(
      (total, produto) => total + Math.round(Number(produto.preco.replace('$', '')) * 100), 0,
    );
    const impostoCentavos = Math.round(subtotalCentavos * 0.08);
    await expect(checkout.elements.subtotal).toHaveText(`Item total: $${(subtotalCentavos / 100).toFixed(2)}`);
    await expect(checkout.elements.tax).toHaveText(`Tax: $${(impostoCentavos / 100).toFixed(2)}`);
    await expect(checkout.elements.total).toHaveText(`Total: $${((subtotalCentavos + impostoCentavos) / 100).toFixed(2)}`);
  });

  await test.step('Finalizar e confirmar o pedido', async () => {
    await checkout.finish();

    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(checkout.elements.confirmation).toBeVisible();
    await expect(checkout.elements.completeText).toHaveText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
    );
    await expect(checkout.elements.cartBadge).toHaveCount(0);
  });
});
