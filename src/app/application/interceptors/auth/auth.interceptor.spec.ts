import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthInterceptor],
    });
    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should add Authorization header with token to the request', () => {
    const authToken = 'test-token';
    const request = new HttpRequest('GET', 'https://example.com/api');
    const handler = {
      handle: jest.fn().mockReturnValue(of({} as HttpEvent<any>)),
    };

    jest.spyOn(sessionStorage, 'getItem').mockReturnValue(authToken);

    interceptor.intercept(request, handler).subscribe(() => {
      expect(handler.handle).toHaveBeenCalledWith(
        expect.objectContaining({
          setHeaders: {
            Authorization: `Bearer ${authToken}`,
          },
        })
      );
    });
  });

  it('should not add Authorization header if token is not present', () => {
    const request = new HttpRequest('GET', 'https://example.com/api');
    const handler = {
      handle: jest.fn().mockReturnValue(of({} as HttpEvent<any>)),
    };

    jest.spyOn(sessionStorage, 'getItem').mockReturnValue(null);

    interceptor.intercept(request, handler).subscribe(() => {
      expect(handler.handle).toHaveBeenCalledWith(request);
    });
  });
});
