import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface SearchOptions {
  Name: string;
  LastName: string;
  ID: string;
}

@Component({
  selector: 'app-form-pagos',
  templateUrl: './form-pagos.page.html',
  styleUrls: ['./form-pagos.page.scss'],
  standalone: false,
})
export class FormPagosPage implements OnInit {
  @Input() public value: number | string | undefined;

  public paymentForm!: FormGroup;
  public submittedResult: any = null;
  // Searchbar related
  public searchData: SearchOptions[] = [
    {
      Name: 'fulanito',
      LastName: 'de tal',
      ID: '1234',
    },
    { Name: 'fulanito2', LastName: 'de tal2', ID: '12345' },
    { Name: 'Rafa', LastName: 'Mallarino', ID: '1042576911' },
  ];
  public filteredResults: SearchOptions[] = [];
  public searchQuery: string = '';

  constructor(private readonly formBuilder: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {
    // if an initial value was passed as input, patch it into the form
    if (this.value !== undefined && this.paymentForm) {
      this.paymentForm.get('amount')?.setValue(this.value);
    }
  }

  private initForm() {
    this.paymentForm = this.formBuilder.group({
      payerName: [{ value: '', disabled: true }],
      documentNumber: [{ value: '', disabled: true }, [Validators.pattern(/^\d{5,20}$/)]],
      amount: [this.value ?? '', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });
  }

  public submitPaymentForm() {
    if (!this.paymentForm.valid) {
      // mark all controls as touched so validations appear
      Object.values(this.paymentForm.controls).forEach((c) => c.markAsTouched());
      console.warn('Formulario inválido', this.paymentForm.getRawValue());
      return;
    }

    // include disabled fields (payerName, documentNumber)
    const payload = { ...this.paymentForm.getRawValue() };
    // show values in console and in the UI
    console.log('Payment form submitted:', payload);
    this.submittedResult = payload;
    // reset form if desired keeping amount as provided
    // this.paymentForm.reset();
  }

  // Search handlers
  public onSearchInput(value: string) {
    this.searchQuery = value ?? '';
    const q = (this.searchQuery || '').trim().toLowerCase();
    if (!q) {
      this.filteredResults = [];
      return;
    }
    this.filteredResults = this.searchData.filter(
      (item) =>
        item.Name.toLowerCase().includes(q) ||
        item.LastName.toLowerCase().includes(q) ||
        item.ID.toLowerCase().includes(q)
    );
  }

  public selectSearchResult(item: SearchOptions) {
    // populate form with selected student
    this.paymentForm
      .get('payerName')
      ?.setValue(`${item.Name} ${item.LastName}`);
    this.paymentForm.get('documentNumber')?.setValue(item.ID);
    this.searchQuery = `${item.Name} ${item.LastName}`;
    this.filteredResults = [];
  }
}
