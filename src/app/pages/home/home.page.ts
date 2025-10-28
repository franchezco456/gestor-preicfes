import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

<<<<<<< Updated upstream
  constructor() {}
=======

  constructor(private readonly authSrv: Auth,
    private readonly institutionSrv: Institution,
    public readonly querySrv: Query,
    private readonly preferencesSrv: Preferences,
    private readonly router: Router) { }

  public async go() {
    const register = await this.authSrv.register("hello1@gmail.com", "world2");
    console.log("TAG: REGISTER" + JSON.stringify(register));

    const login = await this.authSrv.login("hello1@gmail.com", "world2");
    console.log("TAG: LOGIN" + JSON.stringify(login));
    const uni: In = {
      Dane: "12345",
      Name: "la salle",
      Address: "bicentenario",
      Course_Value: 500000
    }
    const uni2: In = {
      Dane: "123456",
      Name: "la salle",
      Address: "la popa",
      Course_Value: 350000
    }
    const uni3: In = {
      Dane: "1234567",
      Name: "inem",
      Address: "el bosque",
      Course_Value: 150000
    }

    const filter_delete_uni = {
      Dane: "123456"
    }


    let filters = {
      Dane: "12345",
      Name: "",
      Address: "",
      Course_Value: null
    }

    let new_uni = {
      Dane: "",
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


  }

  public async execute() {
    const email_param: string = "q@q.com";
    const response = await this.querySrv.execute_Function("is_coordinator", { email_param: email_param });
    console.log(response);
  }
  public async logout() {
    const logout = await this.authSrv.logout();
    console.log("TAG: LOGOUT" + JSON.stringify(logout));
    await this.preferencesSrv.removePreferences("login");
    this.router.navigate(["/login"]);
  }

  public gotoRE() {
    this.router.navigate(["/form-estudiantes"]);
  }

  public gotoRC() {
    this.router.navigate(["/form-coordinadores"]);
  }

  public gotoRI() {
    this.router.navigate(["/form-instituciones"]);
  }

>>>>>>> Stashed changes

}
