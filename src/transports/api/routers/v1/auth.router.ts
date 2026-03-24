import { Router } from 'express';
import { AuthController } from '../../controllers/AuthController';
import { authMiddleware } from '../../../../policies/authMiddleware';
import { validate } from '../../validations/validate.middleware';
import { loginSchema } from '../../validations/auth.validation';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.get('/me', authMiddleware as any, authController.me);
authRouter.post('/logout', authMiddleware as any, authController.logout);

export default authRouter;
