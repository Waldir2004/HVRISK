import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePatientDialogComponent } from './create-patient-dialog.component';

describe('CreatePatientDialogComponent', () => {
  let component: CreatePatientDialogComponent;
  let fixture: ComponentFixture<CreatePatientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePatientDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePatientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
