import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActualizarEstudiantePage } from './actualizar-estudiante.page';

describe('ActualizarEstudiantePage', () => {
  let component: ActualizarEstudiantePage;
  let fixture: ComponentFixture<ActualizarEstudiantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarEstudiantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
