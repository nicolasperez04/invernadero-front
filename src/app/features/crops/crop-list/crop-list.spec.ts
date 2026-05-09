import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { CropListComponent } from './crop-list';

describe('CropListComponent', () => {
  let component: CropListComponent;
  let fixture: ComponentFixture<CropListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CropListComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CropListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
