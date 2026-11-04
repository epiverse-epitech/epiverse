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

describe('IsPassword', () => {
  it.each(['Correct-Horse-1', 'Abcdefg1', `A1${'a'.repeat(126)}`])(
    'accepts %p',
    (password) => {
      expect(errorsFor(password)).toEqual([]);
    },
  );

  it('rejects fewer than 8 characters', () => {
    expect(errorsFor('Abcde1')).toContain(
      'password must be longer than or equal to 8 characters',
    );
  });

  it('rejects more than 128 characters', () => {
    expect(errorsFor(`A1${'a'.repeat(127)}`)).toContain(
      'password must be shorter than or equal to 128 characters',
    );
  });

  it('requires an uppercase letter', () => {
    expect(errorsFor('abcdefg1')).toContain(
      'password must contain an uppercase letter',
    );
  });

  it('requires a digit', () => {
    expect(errorsFor('Abcdefgh')).toContain('password must contain a digit');
  });

  it('rejects whitespace anywhere in the password', () => {
    expect(errorsFor('A1 bcdefg')).toContain('password must not contain whitespace');
  });

  it('rejects a value that is not a string', () => {
    expect(errorsFor(12345678)).toContain('password must be a string');
  });
});
