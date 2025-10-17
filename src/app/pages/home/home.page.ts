import { Component } from '@angular/core';
import { Auth } from 'src/app/core/services/auth/auth';
import { Query } from 'src/app/core/services/query/query';
import { Institution } from 'src/domain/models/Institution';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})



export class HomePage {


  constructor(private readonly authSrv: Auth, private readonly querySrv: Query) { }

  public async go() {
    const register = await this.authSrv.register("hello@gmail.com", "world2");
    console.log("TAG: REGISTER" + JSON.stringify(register));

    const login = await this.authSrv.login("hello@gmail.com", "world2");
    console.log("TAG: LOGIN" + JSON.stringify(login));
    const uni: Institution = {
      NIT: "12345",
      Name: "la salle",
      Address: "bicentenario",
      Course_Value: 500000
    }
    const uni2: Institution = {
      NIT: "123456",
      Name: "la salle",
      Address: "la popa",
      Course_Value: 350000
    }
    const uni3: Institution = {
      NIT: "1234567",
      Name: "inem",
      Address: "el bosque",
      Course_Value: 150000
    }

    const filter_delete_uni = {
      NIT: "123456"
    }


    let filters = {
      NIT: "12345",
      Name: "",
      Address: "",
      Course_Value: null
    }

    let new_uni = {
      NIT: "",
      Name: "nueva selanda",
      Address: "",
      Course_Value: 0
    }

    const create = await this.querySrv.create("Educational_Institution", uni);
    console.log("TAG: CREATE" + JSON.stringify(create));

    const create2 = await this.querySrv.create("Educational_Institution", uni2);
    console.log("TAG: CREATE" + JSON.stringify(create2));

    const create3 = await this.querySrv.create("Educational_Institution", uni3);
    console.log("TAG: CREATE" + JSON.stringify(create3));


    const update = await this.querySrv.update("Educational_Institution", filters, new_uni);
    console.log("TAG: UPDATE" + JSON.stringify(update));

    const deletes = await this.querySrv.delete("Educational_Institution", filter_delete_uni);
    console.log("TAG: DELETE" + JSON.stringify(deletes));

    const getOne = await this.querySrv.getOne("Educational_Institution", filters);
    console.log("TAG: GET ONE" + JSON.stringify(getOne));

    const getAll = await this.querySrv.getAll("Educational_Institution");
    console.log("TAG: GET ALL" + JSON.stringify(getAll));

    const logout = await this.authSrv.logout();
    console.log("TAG: LOGOUT" + JSON.stringify(logout));

  }



}

