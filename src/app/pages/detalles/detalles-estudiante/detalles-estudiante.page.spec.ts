import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesEstudiantePage } from './detalles-estudiante.page';

describe('DetallesEstudiantePage', () => {
  let component: DetallesEstudiantePage;
  let fixture: ComponentFixture<DetallesEstudiantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesEstudiantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
