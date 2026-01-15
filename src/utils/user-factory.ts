import { faker } from '@faker-js/faker';
import { User } from '../interfaces/interfaces';

export const generateUserData: () => User = (): User => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),

    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    address1: faker.location.streetAddress(),
    country: faker.location.country(),
    zipcode: faker.location.zipCode(),
    state: faker.location.state(),
    city: faker.location.street(),
    mobile_number: faker.phone.number()

  };

};
