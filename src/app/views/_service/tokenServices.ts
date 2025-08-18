import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {
  getTokenExpirationDate(token: string): Date | null {
    const tokenPayload = this.getTokenPayload(token);
    if (!tokenPayload || !tokenPayload.exp) {
      return null;
    }

    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(tokenPayload.exp);

    return expirationDate;
  }

  private getTokenPayload(token: string): any {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return null;
    }

    const payloadBase64 = tokenParts[1];
    const payload = atob(payloadBase64);

    return JSON.parse(payload);
  }

  isTokenExpired(token: string): boolean {
    console.log(token)
    if(token != null){
        const expirationDate = this.getTokenExpirationDate(token);
        if (!expirationDate) {
          return false;
        }
        return expirationDate.valueOf() <= new Date().valueOf();
    }
    return true;
  }
}
