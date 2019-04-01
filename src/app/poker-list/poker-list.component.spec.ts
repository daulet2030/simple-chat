import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PokersListComponent } from './votings-list.component';


describe('PokersListComponent', () => {
  let component: PokersListComponent;
  let fixture: ComponentFixture<PokersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PokersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
