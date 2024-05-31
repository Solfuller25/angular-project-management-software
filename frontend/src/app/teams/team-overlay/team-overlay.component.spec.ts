import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamOverlayComponent } from './team-overlay.component';

describe('TeamOverlayComponent', () => {
  let component: TeamOverlayComponent;
  let fixture: ComponentFixture<TeamOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamOverlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
