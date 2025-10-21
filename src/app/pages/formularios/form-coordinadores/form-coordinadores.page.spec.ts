import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { FormCoordinadoresPage } from './form-coordinadores.page';

describe('FormCoordinadoresPage', () => {
  let component: FormCoordinadoresPage;
  let fixture: ComponentFixture<FormCoordinadoresPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormCoordinadoresPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FormCoordinadoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
