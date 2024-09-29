import { PASSWORD } from '../constants/general';

export const randomString = (length?: number): string => {
  if (!length) {
    length = Math.floor(Math.random() * (64 - 8 + 1) + 8);
  }

  const charTypes = Object.keys(PASSWORD);
  const characterList = Object.values(PASSWORD).join('');
  let result = '';

  while (length - charTypes.length > 0) {
    const index = Math.floor(Math.random() * characterList.length);
    result += characterList[index];
    length--;
  }

  for (let i = 0; i < charTypes.length; i++) {
    const index = Math.floor(Math.random() * PASSWORD[charTypes[i]].length);
    result += PASSWORD[charTypes[i]][index];
  }

  return result;
};
