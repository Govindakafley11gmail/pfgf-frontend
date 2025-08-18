import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }
  getItem(key: string): string | null {
    return localStorage.getItem('access_token');
  }

}
