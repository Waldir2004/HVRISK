import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ECGComponent } from './ecg.component';

describe('ECGComponent', () => {
  let component: ECGComponent;
  let fixture: ComponentFixture<ECGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ECGComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ECGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
