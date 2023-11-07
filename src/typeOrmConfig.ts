import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'localtest',
  password: 'localtest',
  database: 'test',
  autoLoadEntities: true,
  synchronize: true, // in production, you might want to set this to false
};
