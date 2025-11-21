import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Loading } from 'src/app/core/services/loading/loading';
import { Query } from 'src/app/core/services/query/query';
import { Toast } from 'src/app/core/services/toast/toast';

@Component({
  selector: 'app-form-instituciones',
  templateUrl: './form-instituciones.page.html',
  styleUrls: ['./form-instituciones.page.scss'],
  standalone: false,
})
export class FormInstitucionesPage {
  public institutionForm !: FormGroup;
  public displayPrice = 90000;
  public id_cicle = '001';

  constructor(private readonly formBuilder: FormBuilder,
    private readonly querySrv : Query,
    private readonly loadingSrv: Loading,
    private readonly toastSrv: Toast) {
    this.initForm();
  }

  private initForm() {
    this.institutionForm = this.formBuilder.group({
      Dane: ['', [Validators.required]],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      Address: ['', [Validators.required, Validators.minLength(5)]],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
      Discount: [0, [Validators.pattern(/^\d+(\.\d{1,7})?$/)]],
      FinancesPreicfes: [false, [Validators.required]],
    });
  }

  public async submitInstitutionForm() {
    if (!this.institutionForm.valid) {
      this.toastSrv.showWarningToast('Por favor, complete todos los campos del formulario');
      return;
    }
    try {
      await this.loadingSrv.showLoading();
       // Valor predeterminado
      const Institution= {
        dane: this.institutionForm.value.Dane,
        name: this.institutionForm.value.Name,
        address: this.institutionForm.value.Address,
        email: this.institutionForm.value.Email,
        phone: this.institutionForm.value.Phone,
        discount: (this.institutionForm.value.Discount == '' || this.institutionForm.value.Discount == null) ? 0 : this.institutionForm.value.Discount,
        free_prices: this.institutionForm.value.FinancesPreicfes
      }
      console.log('Institution to register:', Institution);
      const result = await this.querySrv.execute_Function('register_ie', Institution);
      console.log('Institution registration result:', result);
      this.institutionForm.reset({
        Dane: '',
        Name: '',
        Address: '',
        Email: '',
        Phone: '',
        Discount: 0,
        FinancesPreicfes: false
      });
      await this.loadingSrv.dismissLoading();
      await this.toastSrv.showSuccessToast('Institución agregada exitosamente.');
    } catch (error) {
      this.toastSrv.showErrorToast("Error al agregar la institución educativa.");
      await this.loadingSrv.dismissLoading();
    }

  }
}
