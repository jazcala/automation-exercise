import { test, expect } from '../../src/fixtures/base-fixture';
import { Brand } from '../../src/interfaces/interfaces';

test.describe('Brands API Tests', () => {

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
      expect.soft(item).toMatchObject({
        id: expect.any(Number),
        brand: expect.any(String)
      });
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
});
