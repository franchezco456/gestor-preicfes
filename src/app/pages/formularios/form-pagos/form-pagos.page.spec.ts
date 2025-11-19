import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormPagosPage } from './form-pagos.page';

describe('FormPagosPage', () => {
  let component: FormPagosPage;
  let fixture: ComponentFixture<FormPagosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPagosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
