import { MailService } from '.';
import { UrlService } from '../url';

describe('Admin/MailService', () => {
  let service: MailService;
  let urlService: UrlService;

  beforeEach(async () => {
    urlService = new UrlService();
    service = new MailService(urlService);
  });

  it('should generate a valid password with a valid hash', async () => {
    const mail = await service.send('teste@email.com', 'Teste', 'user-create', {
      firstName: 'FirstName Teste',
      password: 'Password Teste'
    });

    expect(mail.to).toBe('teste@email.com');
    expect(mail.subject).toBe('Teste');
    expect(mail.html).toContain('FirstName Teste');
    expect(mail.html).toContain('Password Teste');
  });
});
