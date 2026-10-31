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

  describe('verify', () => {
    it('accepts the password the hash was made from', async () => {
      const hash = await service.hash(password);

      await expect(service.verify(password, hash)).resolves.toBe(true);
    });

    it('rejects a different password', async () => {
      const hash = await service.hash(password);

      await expect(service.verify('Wrong-Horse-1', hash)).resolves.toBe(false);
    });
  });
});
