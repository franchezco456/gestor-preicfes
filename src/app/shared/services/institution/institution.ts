import { Injectable } from '@angular/core';
import { Query } from 'src/app/core/services/query/query';
import { Institution as In } from 'src/domain/models/Institution';

@Injectable({
  providedIn: 'root'
})
export class Institution {
  constructor(private readonly querySrv: Query) { }

  async addInstitution(institution: In) {
    const response = await this.querySrv.create('Educational_Institution', institution);
    return response;
  }

  async deleteInstitution(filter: Record<string, any>) {
    const response = await this.querySrv.delete('Educational_Institution', filter);
    return response;
  }

  async updateInstitution(filter: Record<string, any>, institution: In) {
    const response = await this.querySrv.update('Educational_Institution', filter, institution);
    return response;
  }

  async getInstitution(filter: Record<string, any>) {
    const response = await this.querySrv.getOne('Educational_Institution', filter);
    return response;
  }

  async getAllInstitutions() {
    const response = await this.querySrv.getAll('Educational_Institution');
    return response;
  }
}
