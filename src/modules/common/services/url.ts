/* istanbul ignore file */
import { Injectable } from '@nestjs/common';
import { API_DNS, APP_DNS } from 'settings';

@Injectable()
export class UrlService {
  public home(): string {
    return API_DNS;
  }

  public content(content: string): string {
    return `${API_DNS}/api/content/${content}`;
  }

  public informative(informativeId: number, churchSlug: string): string {
    return `${API_DNS}/${churchSlug}/informativo/${informativeId}`;
  }

  public resetPassword(token: string): string {
    return `${API_DNS}/nova-senha?t=${token}`;
  }

  public facebookCallback(): string {
    return `${API_DNS}/api/admin/auth/facebook/callback`;
  }

  public googleCallback(): string {
    return `${API_DNS}/api/admin/auth/google/callback`;
  }

  public loginMessage(message: string): string {
    return `${APP_DNS}/social-callback?m=${message}`;
  }

  public loginSocial(token: string): string {
    return `${APP_DNS}/social-callback?t=${token}`;
  }
}
