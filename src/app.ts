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

app.use('/api/auth', authRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
app.use('/api/admin/jobs', adminJobRoutes);
app.use('/api/admin/chat', adminChatRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use("/api/admin/testimonials", adminTestimonialRoutes);
app.use('/api/admin/packages', adminPackageRoutes);
app.use('/api/admin/payments', adminPaymentRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/user', userRoutes);


app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: appConfig.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

export default app;
