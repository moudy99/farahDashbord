import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOwnersRequestsComponent } from './new-owners-requests.component';

describe('NewOwnersRequestsComponent', () => {
  let component: NewOwnersRequestsComponent;
  let fixture: ComponentFixture<NewOwnersRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewOwnersRequestsComponent]
    });
    fixture = TestBed.createComponent(NewOwnersRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
