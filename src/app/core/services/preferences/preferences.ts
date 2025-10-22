import { Injectable } from '@angular/core';
import { Preferences as CapPreferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class Preferences {

  async setPreferences(key: string, value: any): Promise<void> {
    try {
      await CapPreferences.set({
        key,
        value: JSON.stringify(value)
      });
    } catch (error) {
      console.error(`Error al guardar preferencia ${key}:`, error);
      throw error;
    }
  }

  async getPreferences(key: string): Promise<any> {
    try {
      const result = await CapPreferences.get({ key });
      if (result.value) {
        return JSON.parse(result.value);
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error al obtener preferencia ${key}:`, error);
      throw error;
    }
  }


  async updatePreferences(key: string, value: any): Promise<void> {
    try {
      await this.setPreferences(key, value);
    } catch (error) {
      console.error(`Error al actualizar preferencia ${key}:`, error);
      throw error;
    }
  }


  async removePreferences(key: string): Promise<void> {
    try {
      await CapPreferences.remove({ key });
    } catch (error) {
      console.error(`Error al eliminar preferencia ${key}:`, error);
      throw error;
    }
  }


  async clearPreferences(): Promise<void> {
    try {
      await CapPreferences.clear();
    } catch (error) {
      console.error('Error al limpiar preferencias:', error);
      throw error;
    }
  }


  async getAllPreferences(): Promise<{ [key: string]: any }> {
    try {
      const result = await CapPreferences.keys();
      const allPreferences: { [key: string]: any } = {};
      for (const key of result.keys) {
        const value = await this.getPreferences(key);
        allPreferences[key] = value;
      }

      return allPreferences;
    } catch (error) {
      console.error('Error al obtener todas las preferencias:', error);
      throw error;
    }
  }
}
