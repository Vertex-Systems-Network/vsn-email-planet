declare module "pg" {
  export type QueryResult<Row = Record<string, unknown>> = { rows: Row[] };

  export class Pool {
    constructor(config?: {
      connectionString?: string;
      application_name?: string;
      max?: number;
    });
    query<Row = Record<string, unknown>>(text: string, values?: unknown[]): Promise<QueryResult<Row>>;
    end(): Promise<void>;
  }
}
