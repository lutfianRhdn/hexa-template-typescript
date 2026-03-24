import { Router } from 'express';
import authRouter from './auth.router';
import { domainGate } from '../../../../policies/domainGate';

const v1Router = Router();

// Domain gate applies to all routes — resolves MASTER vs TENANT
v1Router.use(domainGate as any);

v1Router.use('/auth', authRouter);

// ─── ADD YOUR ROUTES BELOW ───────────────────────
// import usersRouter from './users.router';
// v1Router.use('/users', authMiddleware, tenantContextMiddleware, usersRouter);
// ───────────────────────────────────────────

export default v1Router;
