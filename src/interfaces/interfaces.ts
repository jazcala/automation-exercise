export interface User {
  name: string;
  email: string;
  password: string;
  title?: 'Mr.' | 'Mrs.' | '';
  birth_day?: string;
  birth_month?: string;
  birth_year?: string;
  first_name: string;
  last_name: string;
  company?: string;
  address1: string;
  address2?: string;
  country: 'India' | 'United States' | 'Canada' | 'Australia' | 'Israel' | 'New Zealand' | 'Singapore';
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
  newsletter?: boolean;
  offers?: boolean;
}

export interface Brand {
  id: number;
  brand: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: { usertype: string };
    category: string;
  };
}

export interface CartItem {
  description: string;
  price: string;
  quantity: string;
  total: string;
}
