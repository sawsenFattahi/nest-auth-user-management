import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import * as dotenv from 'dotenv';

import { AppModule } from '@um/app.module';

import type { Connection } from 'mongoose';

// Charge le fichier .env.test (si ce fichier est présent)
dotenv.config({ path: '.env.test' });

let connection: Connection;

export async function setupTestApp() {
  const moduleFixture = await Test.createTestingModule({
    imports: [
      AppModule,
      MongooseModule.forRoot('mongodb://localhost:27017/test-db'), // Utiliser une base spécifique
    ],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  connection = moduleFixture.get(getConnectionToken());

  return { app, connection };
}
