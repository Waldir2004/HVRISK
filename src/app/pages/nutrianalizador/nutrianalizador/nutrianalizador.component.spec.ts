import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutrianalizadorComponent } from './nutrianalizador.component';

describe('NutrianalizadorComponent', () => {
  let component: NutrianalizadorComponent;
  let fixture: ComponentFixture<NutrianalizadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutrianalizadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NutrianalizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
