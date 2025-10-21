import { Component } from '@angular/core';
import { Auth } from 'src/app/core/services/auth/auth';
import { Institution } from 'src/app/shared/services/institution/institution';
import { Institution as In } from 'src/domain/models/Institution';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})



export class HomePage {


  constructor(private readonly authSrv: Auth, private readonly institutionSrv : Institution) { }

  public async go() {
    const register = await this.authSrv.register("hello1@gmail.com", "world2");
    console.log("TAG: REGISTER" + JSON.stringify(register));

    const login = await this.authSrv.login("hello1@gmail.com", "world2");
    console.log("TAG: LOGIN" + JSON.stringify(login));
    const uni: In = {
      NIT: "12345",
      Name: "la salle",
      Address: "bicentenario",
      Course_Value: 500000
    }
    const uni2: In = {
      NIT: "123456",
      Name: "la salle",
      Address: "la popa",
      Course_Value: 350000
    }
    const uni3: In = {
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

    const create = await this.institutionSrv.addInstitution(uni);
    console.log("TAG: CREATE" + JSON.stringify(create));

    const create2 = await this.institutionSrv.addInstitution(uni2);
    console.log("TAG: CREATE" + JSON.stringify(create2));

    const create3 = await this.institutionSrv.addInstitution(uni3);
    console.log("TAG: CREATE" + JSON.stringify(create3));


    const update = await this.institutionSrv.updateInstitution(filters, new_uni);
    console.log("TAG: UPDATE" + JSON.stringify(update));

    const deletes = await this.institutionSrv.deleteInstitution(filter_delete_uni);
    console.log("TAG: DELETE" + JSON.stringify(deletes));

    const getOne = await this.institutionSrv.getInstitution(filters);
    console.log("TAG: GET ONE" + JSON.stringify(getOne));

    const getAll = await this.institutionSrv.getAllInstitutions();
    console.log("TAG: GET ALL" + JSON.stringify(getAll));

    const logout = await this.authSrv.logout();
    console.log("TAG: LOGOUT" + JSON.stringify(logout));

  }



}

