import AuthService from '@src/services/auth';
import { Response, Request, NextFunction } from 'express';

//como o request possui alguns campos que são obrigatórios, usamos o partial<Request> para dizer que agora todos os campos são opcionais, então vamos passar apenas os que nos importam
export function authMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void {
  //como acima definimso que todos os campos serão opcionais, teremos que fazer um check no campo req.headers usando o ?. assim ele já entende que será feito uma verificação antes para ver se ele não está null
  const token = req.headers?.['x-access-token'];

  try {
    const decoded = AuthService.decodeToken(token as string);
    req.decoded = decoded;
    next();
  } catch (err) {
    res.status?.(401).send({ code: 401, error: err.message });
  }
}
