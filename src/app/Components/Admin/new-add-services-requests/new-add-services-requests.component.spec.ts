import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAddServicesRequestsComponent } from './new-add-services-requests.component';

describe('NewAddServicesRequestsComponent', () => {
  let component: NewAddServicesRequestsComponent;
  let fixture: ComponentFixture<NewAddServicesRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewAddServicesRequestsComponent]
    });
    fixture = TestBed.createComponent(NewAddServicesRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
