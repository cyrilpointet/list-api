import express from "express";
import { Like } from "typeorm";

export class QueryHelper {
  static getOptions(req: express.Request) {
    return {
      where: this.getQueryFilters(req),
      order: this.getQuerySort(req),
      skip: this.getQuerySkip(req),
      take: this.getQueryTake(req),
    };
  }

  static getQueryFilters(req: express.Request): Record<string, string> {
    const queryFilter = {};
    const reqFilter =
      req.query.filter && typeof req.query.filter === "string"
        ? JSON.parse(req.query.filter)
        : {};
    for (const [key, value] of Object.entries(reqFilter)) {
      queryFilter[key] = Like(`%${value}%`);
    }
    return queryFilter;
  }

  static getQuerySort(req: express.Request): Record<string, "ASC" | "DESC"> {
    return req.query.sort
      ? {
          [req.query.sort as string]:
            req.query.order === "ASC" ? "ASC" : "DESC",
        }
      : {};
  }

  static getQueryTake(req: express.Request): number {
    return req.query.perPage ? parseInt(req.query.perPage as string) : 0;
  }

  static getQuerySkip(req: express.Request): number {
    return req.query.page && req.query.perPage
      ? (parseInt(req.query.page as string) - 1) *
          parseInt(req.query.perPage as string)
      : 0;
  }
}
