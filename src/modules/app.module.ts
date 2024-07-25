import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import { join } from 'path';
import { WinstonModule } from "nest-winston";
import * as winston from 'winston';
import { LogHelper } from "../app/helpers/log.helper";
import {ConfigModule, ConfigService} from '@nestjs/config';
import 'winston-daily-rotate-file';
import jwtConfiguration from 'src/config/jwt.config';
import { TypeOrmModule } from "@nestjs/typeorm";
import dataSourceDefaultOptions from "../../ormconfig";
import { AwsS3Service } from "./common/aws-s3/aws-s3.service";
import { GoogleDriveService } from "./common/google-drive/google-drive.service";
import googleConfiguration from 'src/config/google.config';
import s3Configuration from 'src/config/s3.config';
import { DynamicLoaderModule } from './base/dynamic-loader.module';

const logHelper = LogHelper.getInstance();

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    this.bootstrap();
  }

  private async bootstrap() {
    const modulePath = 'src/modules';
    const dynamicModule = await DynamicLoaderModule.loadModules(modulePath);
    const module =  await DynamicLoaderModule.findModuleNames(modulePath);
    console.log(module)

    @Module({
      imports: [
        ...dynamicModule,
        TypeOrmModule.forRoot(dataSourceDefaultOptions),
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          load: [
            jwtConfiguration,
            googleConfiguration,
            s3Configuration,
          ],
        }),
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          resolvers: [AcceptLanguageResolver],
          loaderOptions: {
            path: join(__dirname, '..', '..', 'resources', '/lang/'),
            watch: true,
          },
        }),
        WinstonModule.forRootAsync({
          imports: [ConfigModule.forRoot()],
          useFactory: async (configService: ConfigService) => ({
            transports: [
              new winston.transports.DailyRotateFile(logHelper.winstonOptions('error')),
              new winston.transports.DailyRotateFile(logHelper.winstonOptions('debug')),
              new winston.transports.Console({
                handleExceptions: true,
                format: logHelper.logFormat(),
              }),
            ],
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: 'S3_UPLOAD',
          useClass: AwsS3Service,
        },
        {
          provide: 'DRIVE_UPLOAD',
          useClass: GoogleDriveService,
        },
      ],
    })
    class ImportedModule {}

    return ImportedModule;
  }
}
