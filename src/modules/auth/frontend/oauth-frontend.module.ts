import HotModule from '@/types/HotReload';
import { DynamicModule, Module } from '@nestjs/common';
import { RenderModule } from 'nest-next';
import Next from 'next';
import path from 'path';
import { ClientModule } from '../../client/client.module';
import { AuthModule } from '../auth.module';
import { OAuthFrontendController } from './oauth-frontend.controller';

declare const module: HotModule;

@Module({})
export class OAuthFrontendModule {
  public static initialize(): DynamicModule {
    /* При инициализации модуля попробуем извлечь инстанс RenderModule
            из персистентных данных между перезагрузками модуля */
    const RenderModuleСache =
      module.hot?.data?.RenderModuleСache ??
      RenderModule.forRootAsync(Next({ dev: true }), {
        viewsDir: null,
        passthrough404: false,
      });

    if (module.hot) {
      /* При завершении работы старого модуля
                будем кэшировать инстанс RenderModule */
      module.hot.dispose((data) => {
        data.RenderModuleСache = RenderModuleСache;
      });
    }

    console.log(path.join(__dirname, '..', 'src', '**', '*.entity{.ts,.js}'));

    return {
      module: OAuthFrontendModule,
      controllers: [OAuthFrontendController],
      imports: [RenderModuleСache, AuthModule, ClientModule],
    };
  }
}
