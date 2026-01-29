import { faker } from '@faker-js/faker';
import { User } from '../interfaces/interfaces';

export const generateUserData = (isFull: boolean = false): User => {
  const user: User = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),

    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    address1: faker.location.streetAddress(),
    country: faker.helpers.arrayElement(['India', 'United States', 'Canada', 'Australia', 'Israel', 'New Zealand', 'Singapore']),
    zipcode: faker.location.zipCode(),
    state: faker.location.state(),
    city: faker.location.street(),
    mobile_number: faker.phone.number()

  };
  const birthFullDate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
  if (isFull) {
    return {
      ...user,
      title: faker.helpers.arrayElement(['Mr.', 'Mrs.']),
      birth_day: birthFullDate.getDate().toString(),
      birth_month: birthFullDate.getMonth().toString(),
      birth_year: birthFullDate.getFullYear().toString(),
      company: faker.company.name(),
      address2: faker.location.secondaryAddress(),
      newsletter: true,
      offers: true
    };
  }

  return user;

};
