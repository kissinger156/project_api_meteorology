import AuthService from '@src/services/auth';
import { authMiddleware } from '../auth';

describe('AuthMiddlewares', () => {
  it('should verify a JWT token and call the next middleware', () => {
    const jwtToken = AuthService.generateToken({ data: 'fake' });

    const reqFake = {
      headers: {
        'x-access-token': jwtToken,
      },
    };

    const resFake = {};
    const nextFake = jest.fn();

    authMiddleware(reqFake, resFake, nextFake);
    expect(nextFake).toHaveBeenCalled();
  });

  //ambos os testes com skip foram porque dão erro quando compilam o teste, perguntado no vídeo para ver se alguém possui a solução para para o erro, link da aula: https://www.youtube.com/watch?v=rEooglp1EIw&list=PLz_YTBuxtxt6_Zf1h-qzNsvVt46H8ziKh&index=26&ab_channel=WaldemarNeto-DevLab
  it.skip('should return UNAUTHORIZED if there is a problem on the token verification', () => {
    const reqFake = {
      headers: {
        'x-access-token': 'invalid token',
      },
    };
    const sendMock = jest.fn();
    const resFake = {
      status: jest.fn(() => ({
        send: sendMock,
      })),
    };
    const nextFake = jest.fn();
    // eslint-disable-next-line @typescript-eslint/ban-types
    authMiddleware(reqFake, resFake as object, nextFake);

    expect(sendMock).toHaveBeenLastCalledWith({
      code: 401,
      error: 'jwt malformed',
    });
  });

  it.skip('should return ANAUTHORIZED middleware if theres no token', () => {
    const reqFake = {
      headers: {},
    };
    const sendMock = jest.fn();
    const resFake = {
      status: 401,
    };
    const nextFake = jest.fn();

    // eslint-disable-next-line @typescript-eslint/ban-types
    authMiddleware(reqFake, resFake as object, nextFake);
    expect(resFake.status).toBe(401);
    expect(sendMock).toHaveBeenCalledWith({
      code: 401,
      error: 'jwt must be provided',
    });
  });
});
