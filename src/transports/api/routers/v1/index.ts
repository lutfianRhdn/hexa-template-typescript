import { Router } from 'express';
import authRouter from './auth.router';

const v1Router = Router();

v1Router.use('/auth', authRouter);

// ─── ADD YOUR ROUTES BELOW ───────────────────────
// import productsRouter from './products.router';
// v1Router.use('/products', productsRouter);
// ───────────────────────────────────────────

export default v1Router;
