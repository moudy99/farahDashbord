import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangeServicesComponent } from './mange-services.component';

describe('MangeServicesComponent', () => {
  let component: MangeServicesComponent;
  let fixture: ComponentFixture<MangeServicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MangeServicesComponent]
    });
    fixture = TestBed.createComponent(MangeServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
