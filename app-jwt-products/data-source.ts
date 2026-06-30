import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({   
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "hamburgeria",
    synchronize: false,
    logging: true,
    entities: ["src/**/*.entity.ts"],
    migrations: ["src/migrations/*.ts"],
    subscribers: ["src/subscriber/*.ts"],
});