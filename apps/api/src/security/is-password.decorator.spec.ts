import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { IsPassword } from './is-password.decorator';

class PasswordDto {
  @IsPassword()
  password!: string;
}

function errorsFor(password: unknown): string[] {
  const dto = plainToInstance(PasswordDto, { password });
  return validateSync(dto).flatMap((error) =>
    Object.values(error.constraints ?? {}),
  );
}

describe('IsPassword (single-factor password policy)', () => {
  it.each([
    'correct horse battery staple',
    'onlylowercasecharacters',
    'étoiles paisibles pour toujours',
    'A1' + 'a'.repeat(126),
    'x'.repeat(15),
  ])('accepts passphrases and passwords without composition constraints: %p', (password) => {
    expect(errorsFor(password)).toEqual([]);
  });

  it('rejects fewer than 15 characters', () => {
    expect(errorsFor('abcdefghijklm')).toContain(
      'password must be longer than or equal to 15 characters',
    );
  });

  it('rejects more than 128 characters', () => {
    expect(errorsFor('x'.repeat(129))).toContain(
      'password must be shorter than or equal to 128 characters',
    );
  });

  it('does not coerce non-string inputs', () => {
    expect(errorsFor(12345678)).toContain('password must be a string');
  });
});
