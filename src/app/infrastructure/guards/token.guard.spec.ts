import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TokenGuard } from './token.guard';

describe('TokenGuard', () => {
  let tokenGuard: TokenGuard;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(() => {
    const routerSpyObj = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        TokenGuard,
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    tokenGuard = TestBed.inject(TokenGuard);
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should allow loading when token exists', () => {
    jest.spyOn(sessionStorage, 'getItem').mockReturnValue('dummy-token');

    const result = tokenGuard.canLoad();

    expect(result).toBe(true);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to login when token is missing', () => {
    jest.spyOn(sessionStorage, 'getItem').mockReturnValue(null);

    const result = tokenGuard.canLoad();

    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth', 'login']);
  });
});
