import { dim } from './../../../../../node_modules/colors/index.d';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Loading } from 'src/app/core/services/loading/loading';
import { Toast } from 'src/app/core/services/toast/toast';
import { Institution } from 'src/app/shared/services/institution/institution';
import { Institution as In } from 'src/domain/models/Institution';

@Component({
  selector: 'app-form-instituciones',
  templateUrl: './form-instituciones.page.html',
  styleUrls: ['./form-instituciones.page.scss'],
  standalone: false,
})
export class FormInstitucionesPage {
  public institutionForm !: FormGroup;
  // Price shown in the UI (formatted). This is the public/display price.
  public displayPrice: number = 250000;

  constructor(private readonly formBuilder: FormBuilder,
    private readonly institutionSrv: Institution,
    private readonly loadingSrv: Loading,
    private readonly toastSrv: Toast) {
    this.initForm();
  }

  private initForm() {
    this.institutionForm = this.formBuilder.group({
      Nit: ['', [Validators.required, Validators.pattern(/^\d{3,12}$/)]],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      Address: ['', [Validators.required, Validators.minLength(5)]],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
      // Course_Value removed from inputs; backend provides it. Keep Discount optionally if needed
      Discount: ['', [Validators.pattern(/^\d+(\.\d{1,7})?$/)]],
      FinancesPreicfes: [false]
    });
  }

  public async submitInstitutionForm() {
    if (!this.institutionForm.valid) {
      this.toastSrv.showWarningToast('Por favor, complete todos los campos del formulario');
      return;
    }
    try {
      await this.loadingSrv.showLoading();
      
      const Institution: In = {
        NIT: this.institutionForm.value.Nit,
        Name: this.institutionForm.value.Name,
        Address: this.institutionForm.value.Address,
        // Course_Value se envía tal cual como displayPrice (valor estático por ahora)
        Course_Value: this.displayPrice,
        Email: this.institutionForm.value.Email,
        Phone: this.institutionForm.value.Phone,
        FinancesPreicfes: !!this.institutionForm.value.FinancesPreicfes,
        Discount: this.institutionForm.value.Discount,
        
        
      } as In;
      const result = await this.institutionSrv.addInstitution(Institution);
      this.institutionForm.reset();
      await this.loadingSrv.dismissLoading();
      await this.toastSrv.showSuccessToast('Institución agregada exitosamente.');
    } catch (error) {
      this.toastSrv.showErrorToast("Error al agregar la institución educativa.");
      await this.loadingSrv.dismissLoading();
    }

  }

  public test(event: boolean) {
    
    console.log(event ? 'SI' : 'NO');
    this.institutionForm.get('FinancesPreicfes')?.setValue(!!event);
  }

  
  public formatCurrency(value: number): string {
    if (value == null || isNaN(value)) return '$0';
    return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }


}
