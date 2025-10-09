import { sql } from './app.js'

await sql`
insert into users (name, email, password) values ('teste', 'teste@gmail.com', '12345');`