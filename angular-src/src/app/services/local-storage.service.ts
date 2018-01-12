import {Injectable} from '@angular/core';

@Injectable()
export class LocalStorageService {
  localStorage: any;
  isEnabled = false;

  constructor() {
    if (!window.localStorage) {
      this.isEnabled = false;
      console.error('Current browser does not support Local Storage');
      return;
    }
    this.isEnabled = true;
    this.localStorage = window.localStorage;
  }

  public useSessionStorage() {
    if (this.isEnabled) {
      this.localStorage = window.sessionStorage;
    }
  }

  public useLocalStorage() {
    if (this.isEnabled) {
      this.localStorage = window.localStorage;
    }
  }

  public set(key: string, value: string): void {
    if (this.isEnabled) {
      this.localStorage[key] = value;
    }
  }

  public get(key: string): string {
    if (!this.isEnabled) {
      return '';
    }

    return this.localStorage[key] || false;
  }

  public setObject(key: string, value: any): void {
    if (!this.isEnabled) {
      return;
    }
    this.localStorage[key] = JSON.stringify(value);
  }

  public getObject(key: string): any {
    if (!this.isEnabled) {
      return null;
    }
    return JSON.parse(this.localStorage[key] || '{}');
  }

  public remove(key: string): any {
    if (!this.isEnabled) {
      return null;
    }
    this.localStorage.removeItem(key);
  }

  public clear() {
    this.localStorage.clear();
  }
}

export const LOCAL_STORAGE_PROVIDERS: any[] = [
  LocalStorageService
];
