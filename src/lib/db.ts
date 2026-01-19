import { schema } from '../../zenstack/schema';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { ZenStackClient } from '@zenstackhq/orm';
import { PostgresDialect } from '@zenstackhq/orm/dialects/postgres';
import { PolicyPlugin } from '@zenstackhq/plugin-policy';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

export const db = new ZenStackClient(schema, {
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: process.env.DATABASE_URL,
		}),
	}),
}).$use(new PolicyPlugin());
