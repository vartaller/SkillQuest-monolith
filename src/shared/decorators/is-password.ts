import { registerDecorator, ValidationOptions } from 'class-validator';

import { isPassword } from '../utils/is-password';
import { ERRORS } from '../constants/errors';

export const IsPassword = (validationOptions?: ValidationOptions) => {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any): boolean {
          return isPassword(value);
        },
        defaultMessage: () => ERRORS.USER.PASSWORD,
      },
    });
  };
};
