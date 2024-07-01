import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhotographerComponent } from './edit-photographer.component';

describe('EditPhotographerComponent', () => {
  let component: EditPhotographerComponent;
  let fixture: ComponentFixture<EditPhotographerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPhotographerComponent]
    });
    fixture = TestBed.createComponent(EditPhotographerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
