import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { LotListComponent } from './lot-list';

describe('LotListComponent', () => {
  let component: LotListComponent;
  let fixture: ComponentFixture<LotListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotListComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(LotListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
