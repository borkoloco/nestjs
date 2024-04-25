import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
const cookieSession = require('cookie-session');
import { dbConfig } from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot(dbConfig),
    // TypeOrmModule.forRoot(),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}

// TypeOrmModule.forRootAsync({
//   inject: [ConfigService],
//   useFactory: (config: ConfigService) => {
//     return {
//       type: 'sqlite',
//       database: config.get<string>('DB_NAME'),
//       synchronize: true,
//       entities: [User, Report],
//     };
//   },
// }),
// TypeOrmModule.forRoot({
//   type: 'sqlite',
//   database: 'db.sqlite',
//   entities: [User, Report],
//   synchronize: true,
// }),
