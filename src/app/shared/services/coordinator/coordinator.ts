import { Injectable } from '@angular/core';
import { Query } from 'src/app/core/services/query/query';
import {Coordinator as Co} from 'src/domain/models/Coordinator';

@Injectable({
  providedIn: 'root'
})
export class Coordinator {
  constructor(private readonly querySrv: Query) {}

    async addCoordinator(coordinator: Co) {
      const response = await this.querySrv.create('Coordinator', coordinator);
      return response;
    }

    async deleteCoordinator(filter: Record <string , any>) {
      const response = await this.querySrv.delete('Coordinator', filter);
      return response;
    }

    async updateCoordinator(filter: Record <string , any>, coordinator: Co) {
      const response = await this.querySrv.update('Coordinator', filter, coordinator);
      return response;
    }

    async getCoordinator(filter: Record <string , any>) {
      const response = await this.querySrv.getOne('Coordinator', filter);
      return response;
    }

    async getAllCoordinators() {
      const response = await this.querySrv.getAll('Coordinator');
      return response;
    }
}
