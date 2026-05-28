import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeTypologiesComponent } from './bike-typologies.component';

describe('BikeTypologiesComponent', () => {
  let component: BikeTypologiesComponent;
  let fixture: ComponentFixture<BikeTypologiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BikeTypologiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikeTypologiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
