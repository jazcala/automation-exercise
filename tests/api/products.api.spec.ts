import { test, expect } from '../../src/fixtures/base-fixture';
import { Product } from '../../src/interfaces/interfaces';

const expectedProductSchema = {
  id: expect.any(Number),
  name: expect.any(String),
  price: expect.any(String),
  brand: expect.any(String),
  category: {
    usertype: { usertype: expect.any(String) },
    category: expect.any(String)
  }
};

test.describe('Products API Tests @api', () => {

  test('verify get all product list', async ({ productsApi }) => {
    const response = await productsApi.getProductList();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.responseCode).toBe(200);
    const products: Product[] = body.products;
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    await test.step('Validate search results content and schema', async () => {
      products.forEach((product: Product) => {
        expect.soft(product).toMatchObject(expectedProductSchema);
      });

      const blueTop = products.find(p => p.id === 1);
      expect.soft(blueTop, 'Product with ID 1 should be in the list').toBeDefined();
      expect.soft(blueTop).toMatchObject({
        name: 'Blue Top',
        brand: 'Polo',
      });
    });

  });

  test('verify invalid method - Post', async ({ productsApi }) => {

    const response = await productsApi.invalidMethodPostAllProducts();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect.soft(body.responseCode).toBe(405);
    expect.soft(body.message).toBe('This request method is not supported.');

  });

  test('verify search product', async ({ productsApi }) => {

    const searchTerm = 'top';
    const response = await productsApi.searchProduct(searchTerm);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect.soft(body.responseCode).toBe(200);
    const products: Product[] = body.products;

    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);

    await test.step('Validate search results content and schema', async () => {
      products.forEach((product: Product) => {
        expect.soft(product).toMatchObject(expectedProductSchema);

        const searchMatch =
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.category.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm);

        expect.soft(searchMatch,
          `Product ID ${product.id} (${product.name}) should match the search term '${searchTerm}' in name, category, or brand`
        ).toBe(true);

      });
    });
  });

  test('verify search without search parameter', async ({ productsApi }) => {

    const response = await productsApi.searchProduct();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect.soft(body.responseCode).toBe(400);
    expect.soft(body.message).toBe('Bad request, search_product parameter is missing in POST request.');

  });

});
