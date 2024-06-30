import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHallComponent } from './edit-hall.component';

describe('EditHallComponent', () => {
  let component: EditHallComponent;
  let fixture: ComponentFixture<EditHallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditHallComponent]
    });
    fixture = TestBed.createComponent(EditHallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
