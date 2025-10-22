import { Injectable } from '@angular/core';
import { Query } from 'src/app/core/services/query/query';
import { Student as St } from 'src/domain/models/Student';

@Injectable({
  providedIn: 'root'
})
export class Student {
    constructor(private readonly querySrv: Query) {}

    async addStudent(student: St) {
      const response = await this.querySrv.create('Student', student);
      return response;
    }

    async deleteStudent(filter: Record <string , any>) {
      const response = await this.querySrv.delete('Student', filter);
      return response;
    }
  
    async updateStudent(filter: Record <string , any>, student: St) {
      const response = await this.querySrv.update('Student', filter, student);
      return response;
    }

    async getStudent(filter: Record <string , any>) {
      const response = await this.querySrv.getOne('Student', filter);
      return response;
    }

    async getAllStudents() {
      const response = await this.querySrv.getAll('Student');
      return response;
    }
}
