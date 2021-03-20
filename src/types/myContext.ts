import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import express from "express";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: express.Response<any> & { session: Express.Session };
  res: express.Request<any>;
};
