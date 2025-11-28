import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesPagosPage } from './detalles-pagos.page';

describe('DetallesPagosPage', () => {
  let component: DetallesPagosPage;
  let fixture: ComponentFixture<DetallesPagosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesPagosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
