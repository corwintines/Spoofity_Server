// Numbers and letters without characters that look similar
const CHAR_LIST = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const CHAR_SIZE = CHAR_LIST.length;

/**
 * Return a random string of the given length.
 * Uses a base33 character list.
 */
export function createRandomString(length: number) {
  return new Array(length)
    .fill('0')
    .map(() => {
      const charIndex = Math.floor(Math.random() * CHAR_SIZE);
      return CHAR_LIST.charAt(charIndex);
    })
    .join('');
}

/** Generate an infinite amount of random strings of the given length */
export function* randomStringGenerator(length: number) {
  while (true) {
    yield createRandomString(length);
  }
}
