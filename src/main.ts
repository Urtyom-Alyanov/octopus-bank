import { NestFactory } from '@nestjs/core';
import { MainModule } from '@modules/main/main.module';
import { HttpException, ValidationPipe, VersioningType } from '@nestjs/common';
import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import HotModule from './types/HotReload';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import { RenderService } from 'nest-next';
import { RefreshTokenFilter } from './modules/auth/exception-filters/refresh-token.filter';
import { TokenService } from './modules/auth/token/token.service';
import { PagerMiddleware } from './modules/main/global/middlewares/PagerMiddleware';

declare const module: HotModule;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    MainModule.initialize(),
  );

  app.enableVersioning({
    type: VersioningType.CUSTOM,
    extractor: (request: Request) => {
      return [request.query['v'] || request.query['version'] || '2.0a']
        .map((v) => (typeof v === 'string' ? v : v[0]))
        .flatMap((v) => v.split(','))
        .filter((v) => !!v)
        .sort()
        .reverse();
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useStaticAssets(path.join(__dirname, '..', 'public'));

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const tokenService = app.get(TokenService);
  app.useGlobalFilters(new RefreshTokenFilter(tokenService));

  const frontendService = app.get(RenderService);

  frontendService.setErrorHandler(async (err, req: Request, res: Response) => {
    if (!(err instanceof HttpException)) console.error(err);
    return res.send(err?.response || err);
  });

  app.use(cookieParser());

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  app.use(new PagerMiddleware().use);

  await app.listen(3000);
}
bootstrap();
// --webpack --webpackPath webpack-hmr.config.js
