import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultarPaymentsPage } from './consultar-payments.page';

describe('ConsultarPaymentsPage', () => {
  let component: ConsultarPaymentsPage;
  let fixture: ComponentFixture<ConsultarPaymentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarPaymentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
