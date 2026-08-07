import { randomUUID } from 'crypto';

// Entities generate their own UUIDs in application code (see id column comment in
// each *.entity.js) rather than relying on Postgres's uuid_generate_v4(), which
// would require manually enabling the uuid-ossp extension.
export { randomUUID as newId };
