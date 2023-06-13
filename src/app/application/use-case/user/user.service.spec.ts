import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpClientSpy: Partial<HttpClient>;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
      post: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useValue: httpClientSpy },
      ],
    });

    service = TestBed.inject(UserService);
  });

  it('should call GET method with correct URL to verify username existence', () => {
    const username = 'testuser';
    const expectedResponse = { exists: true };

    (httpClientSpy.get as jest.Mock).mockReturnValue(of(expectedResponse));

    service.verifyUsername(username).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
      expect(httpClientSpy.get).toHaveBeenCalledWith(`${service['baseURL']}/users/exist-name?name=${username}`);
    });
  });

  it('should call POST method with correct URL and body to create a user', () => {
    const userBody = { username: 'testuser', password: 'password' };
    const expectedResponse = { success: true };

    (httpClientSpy.post as jest.Mock).mockReturnValue(of(expectedResponse));

    service.createUser(userBody).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
      expect(httpClientSpy.post).toHaveBeenCalledWith(`${service['baseURL']}/users/create`, userBody);
    });
  });

  it('should call POST method with correct URL and body to login a user', () => {
    const loginBody = { username: 'testuser', password: 'password' };
    const expectedResponse = { token: 'abcd1234' };

    (httpClientSpy.post as jest.Mock).mockReturnValue(of(expectedResponse));

    service.loginUser(loginBody).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
      expect(httpClientSpy.post).toHaveBeenCalledWith(`${service['baseURL']}/users/login`, loginBody);
    });
  });
});
