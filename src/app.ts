import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { appConfig } from './config/env';
import passport from './infrastructure/auth/passport';
import S3Router from './presentation/routes/s3Router';
import authRouter from './presentation/routes/authRouter';
import userRouter from './presentation/routes/userRouter';
import messageRouter from './presentation/routes/messageRouter';
import adminJobRouter from './presentation/routes/adminJobRouter';
import adminChatRouter from './presentation/routes/adminChatRouter';
import adminUsersRouter from './presentation/routes/adminUserRouter';
import adminPaymentRouter from "./presentation/routes/adminPaymentRouter";
import adminPackageRouter from "./presentation/routes/adminPackageRouter";
// import adminSettingsRouter from './presentation/routes/adminSettingsRouter';
import adminTestimonialRouter from './presentation/routes/adminTestimonialRouter';
import adminApplicationRouter from './presentation/routes/adminApplicationRouter';

const app = express();

if (appConfig.nodeEnv === 'development') {
  app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
}

const allowedOrigins = [appConfig.frontendUrl, appConfig.frontendUrl2];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

app.use(compression());
app.use(helmet());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/auth', authRouter);
// app.use("/api/admin/settings", adminSettingsRouter);
app.use('/api/admin/jobs', adminJobRouter);
app.use('/api/admin/chat', adminChatRouter);
app.use('/api/admin/users', adminUsersRouter);
app.use("/api/admin/testimonials", adminTestimonialRouter);
app.use("/api/admin/applications", adminApplicationRouter);
app.use('/api/admin/packages', adminPackageRouter);
app.use('/api/admin/payments', adminPaymentRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);
app.use("/api/s3/file", S3Router);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: appConfig.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

export default app;