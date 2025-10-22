import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Cleaner } from '../../providers/cleaner/cleaner';

@Injectable({
  providedIn: 'root'
})
export class Query {
  //los filtros o objetos, los atributos o columnas que el query service reciba en nulo o vacio seran descartadas automaticamente
  constructor(private supabasePrv : SupabaseClient, private readonly cleanerPrv : Cleaner){}

  async hello(){
    const { data, error } = await this.supabasePrv.rpc('hello_world');
    if (error){
      throw error;
    }
    return data;
  }

  async create(table : string , object : any){
    const {data, error} = await this.supabasePrv.from(table).insert([object]).select();
    if(error){
      return error.message;
    }
    return data
  }

  async delete(table : string , filter : Record <string , any>){
    filter = this.cleanerPrv.clean_data(filter);
    const {data, error} = await this.supabasePrv.from(table).delete().match(filter).select();
    if(error){
      return error.message;
    }
    return data
  }

  async update(table : string ,  filter : Record <string,any>, object : any){
    filter = this.cleanerPrv.clean_data(filter);
    object = this.cleanerPrv.clean_data(object);
    const {data, error} = await this.supabasePrv.from(table).update([object]).match(filter).select();
    if(error){
      return error.message;
    }
    return data
  }

  async getOne(table : string ,  filter : Record <string,any>){
    filter = this.cleanerPrv.clean_data(filter);
    const {data, error} = await this.supabasePrv.from(table).select().match(filter);
    if(error){
      return error.message;
    }
    return data
  }

  async getAll(table : string){
    const {data, error} = await this.supabasePrv.from(table).select();
    if(error){
      return error.message;
    }
    return data
  }
}
