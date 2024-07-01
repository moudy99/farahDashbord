import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBeautyCenterComponent } from './edit-beauty-center.component';

describe('EditBeautyCenterComponent', () => {
  let component: EditBeautyCenterComponent;
  let fixture: ComponentFixture<EditBeautyCenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditBeautyCenterComponent]
    });
    fixture = TestBed.createComponent(EditBeautyCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
