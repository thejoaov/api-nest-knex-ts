import { PasswordService } from './password';

describe('Admin/PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    service = new PasswordService();
  });

  it('should generate a valid password with a valid hash', async () => {
    const { password, hash } = await service.generatePassword();
    expect(typeof password).toBe('string');
    expect(typeof hash).toBe('string');

    const isValid = await service.compare(hash, password);
    expect(isValid).toBeTrue();
  });

  it('should hash a password with a valid hash', async () => {
    const hash = await service.hash('senha@123');
    expect(typeof hash).toBe('string');

    const isValid = await service.compare(hash, 'senha@123');
    expect(isValid).toBeTrue();
  });

  it('should return invalid when a invalid password', async () => {
    const hash = await service.hash('senha@123');
    expect(typeof hash).toBe('string');

    const isValid = await service.compare(hash, 'senha@1234');
    expect(isValid).toBeFalse();
  });

  it('should return invalid when a invalid hash is pass', async () => {
    const isValid = await service.compare('invalid', 'senha@1234');
    expect(isValid).toBeFalse();
  });
});
