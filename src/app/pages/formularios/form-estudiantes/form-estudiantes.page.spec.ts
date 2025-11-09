import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { FormEstudiantesPage } from './form-estudiantes.page';

describe('FormEstudiantesPage', () => {
  let component: FormEstudiantesPage;
  let fixture: ComponentFixture<FormEstudiantesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormEstudiantesPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FormEstudiantesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
