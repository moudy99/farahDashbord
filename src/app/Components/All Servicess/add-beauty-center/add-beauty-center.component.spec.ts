import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBeautyCenterComponent } from './add-beauty-center.component';

describe('AddBeautyCenterComponent', () => {
  let component: AddBeautyCenterComponent;
  let fixture: ComponentFixture<AddBeautyCenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBeautyCenterComponent]
    });
    fixture = TestBed.createComponent(AddBeautyCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
