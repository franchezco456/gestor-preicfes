import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Cleaner {
  constructor(){}

  public clean_data(data: any) {
    Object.keys(data).forEach(key => {
      if (data[key] === null || data[key] === "" && data[key] !== 0) {
        delete data[key];
      }
    });
    return data;
  }
}
