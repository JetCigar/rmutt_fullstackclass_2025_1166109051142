import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutConfirm } from './checkout-confirm';

describe('CheckoutConfirm', () => {
  let component: CheckoutConfirm;
  let fixture: ComponentFixture<CheckoutConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutConfirm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutConfirm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
