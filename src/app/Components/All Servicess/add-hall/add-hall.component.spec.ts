import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHallComponent } from './add-hall.component';

describe('AddHallComponent', () => {
  let component: AddHallComponent;
  let fixture: ComponentFixture<AddHallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddHallComponent]
    });
    fixture = TestBed.createComponent(AddHallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
