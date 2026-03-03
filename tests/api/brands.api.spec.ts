import { test, expect } from '../../src/fixtures/base-fixture';
import { Brand } from '../../src/interfaces/interfaces';
import { brandSchema } from '../../src/utils/api-schemas';

test.describe('Brands API Tests @api', () => {

  test('verify get brands', async ({ brandsApi }) => {

    const response = await brandsApi.getAllBrands();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect.soft(body.responseCode).toBe(200);
    const brands = body.brands;

    expect(brands).toBeDefined();
    expect(Array.isArray(brands)).toBe(true);
    expect(brands.length).toBeGreaterThan(0);

    brands.forEach((item: Brand) => {
      expect.soft(item).toMatchObject(brandSchema);
    });

    expect.soft(brands).toContainEqual({ id: 1, brand: 'Polo' });

  });

  test('verify invalid method - put', async ({ brandsApi }) => {
    const response = await brandsApi.invalidMethodPutAllBrands();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect.soft(body.responseCode).toBe(405);
    expect.soft(body.message).toBe('This request method is not supported.');
  });

  test('invalid method POST on brandsList returns 405', async ({ brandsApi }) => {
    const response = await brandsApi.invalidMethodPostAllBrands();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  });

  test('invalid method DELETE on brandsList returns 405', async ({ brandsApi }) => {
    const response = await brandsApi.invalidMethodDeleteAllBrands();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  });

  test('invalid method PATCH on brandsList returns 405', async ({ brandsApi }) => {
    const response = await brandsApi.invalidMethodPatchAllBrands();
    expect(response.status()).toBe(405);
    const body = await response.json();
    expect(body.detail).toBe('Method "PATCH" not allowed.');
  });

  test('all brands from products exist in brands list', async ({ brandsApi, productsApi }) => {
    const [brandsResponse, productsResponse] = await Promise.all([
      brandsApi.getAllBrands(),
      productsApi.getProductList()
    ]);
    const brandsBody = await brandsResponse.json();
    const productsBody = await productsResponse.json();
    expect(brandsBody.responseCode).toBe(200);
    expect(productsBody.responseCode).toBe(200);

    const brandsList = (brandsBody.brands ?? []) as Brand[];
    const brandNames = new Set(brandsList.map((b) => b.brand));
    const products = (productsBody.products ?? []) as Array<{ brand: string }>;
    const productBrands = [...new Set(products.map((p) => p.brand))];

    expect(productBrands.length).toBeGreaterThan(0);

    for (const brand of productBrands) {
      expect(brandNames.has(brand), `Brand '${brand}' from products should exist in brands list`).toBe(true);
    }

  });
});
