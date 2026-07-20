import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

/** Compile the root component and return a fresh fixture for one test. */
async function createFixture(): Promise<ComponentFixture<App>> {
  await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  return TestBed.createComponent(App);
}

describe('App', () => {
  it('creates the root component', async () => {
    const fixture = await createFixture();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the router outlet shell', async () => {
    const fixture = await createFixture();
    await fixture.whenStable();
    const shell = (fixture.nativeElement as HTMLElement).querySelector('.app-shell');
    expect(shell?.querySelector('router-outlet')).toBeTruthy();
  });
});
