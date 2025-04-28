import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPatientDialogComponent } from './edit-patient-dialog.component';

describe('EditPatientDialogComponent', () => {
  let component: EditPatientDialogComponent;
  let fixture: ComponentFixture<EditPatientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPatientDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPatientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
