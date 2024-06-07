import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhotographerComponent } from './add-photographer.component';

describe('AddPhotographerComponent', () => {
  let component: AddPhotographerComponent;
  let fixture: ComponentFixture<AddPhotographerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPhotographerComponent]
    });
    fixture = TestBed.createComponent(AddPhotographerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
