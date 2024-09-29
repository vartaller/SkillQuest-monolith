import { REGEX } from '../constants/general';

export const isPassword = (password: string): boolean =>
  REGEX.PASSWORD.test(password);
