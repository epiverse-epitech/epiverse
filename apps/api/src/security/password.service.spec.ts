import { PasswordService } from './password.service';

describe('PasswordService', () => {
  const service = new PasswordService();
  const password = 'Correct-Horse-1';

  describe('hash', () => {
    it('produces an Argon2id hash that does not contain the password', async () => {
      const hash = await service.hash(password);

      expect(hash).toMatch(/^\$argon2id\$/);
      expect(hash).not.toContain(password);
    });

    it('salts each hash, so the same password gives two different hashes', async () => {
      const first = await service.hash(password);
      const second = await service.hash(password);

      expect(first).not.toEqual(second);
    });
  });
});
