import { expect } from '@playwright/test';

/**
 * Shared API response schema patterns for consistent validation across tests.
 * Uses expect.any() for flexible matching.
 */

export const productSchema = {
  id: expect.any(Number),
  name: expect.any(String),
  price: expect.any(String),
  brand: expect.any(String),
  category: {
    usertype: { usertype: expect.any(String) },
    category: expect.any(String)
  }
};

export const brandSchema = {
  id: expect.any(Number),
  brand: expect.any(String)
};

export const apiErrorSchema = {
  responseCode: expect.any(Number),
  message: expect.any(String)
};

export const loginSuccessSchema = {
  responseCode: expect.any(Number),
  message: expect.any(String)
};

export const userDetailSchema = {
  name: expect.any(String),
  email: expect.any(String),
  first_name: expect.any(String),
  last_name: expect.any(String),
  address1: expect.any(String),
  country: expect.any(String),
  zipcode: expect.any(String),
  state: expect.any(String),
  city: expect.any(String),
  mobile_number: expect.any(String)
};
