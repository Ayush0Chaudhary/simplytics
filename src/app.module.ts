import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
// import { ClickHouseModule } from '@depyronick/nestjs-clickhouse';

@Module({
  imports: [
    AuthModule,
    // ClickHouseModule.register([
    //   {
    //     name: 'ANALYTICS_SERVER',
    //     host: '127.0.0.1',
    //     password: '7h3ul71m473p4555w0rd',
    //   },
    // ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
