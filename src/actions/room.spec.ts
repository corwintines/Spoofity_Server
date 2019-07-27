import { createRandomString, randomStringGenerator } from './room';

describe('room', () => {
  describe('createRandomString', () => {
    it('creates a random string', () => {
      const string = createRandomString(10);
      expect(string.length).toBe(10);
    });
  });

  describe('randomStringGenerator', () => {
    it('returns an interator for a random string', () => {
      const stringGenerator = randomStringGenerator(4);
      const code1 = stringGenerator.next().value;
      const code2 = stringGenerator.next().value;
      const code3 = stringGenerator.next().value;

      expect(code1.length).toBe(4);
      expect(code2.length).toBe(4);
      expect(code3.length).toBe(4);

      expect(code1).not.toEqual(code2);
      expect(code2).not.toEqual(code3);
    });
  });
});
