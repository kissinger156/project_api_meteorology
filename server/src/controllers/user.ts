import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import { User } from '@src/models/user';
import { BaseController } from '.';
import AuthService from '@src/services/auth';

@Controller('users')
export class UserController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const newUser = await user.save();
      res.status(201).send(newUser);
    } catch (error) {
      this.sendCreatedUpdateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ code: 401, error: 'User not found' });
    }
    if (!(await AuthService.comparePassword(password, user.password))) {
      return res.status(401).send({ code: 401, error: 'Password is wrong' });
    }

    //passando o user como to json, para meio que forçar ele a ser passado como um objeto
    const token = AuthService.generateToken(user.toJSON());
    return res.status(200).send({ token: token });
  }
}
