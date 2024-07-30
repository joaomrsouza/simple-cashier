import { getToday } from "@/lib/utils";
import { Database } from "sqlite3";

export interface SalesDay {
  date: string;
  id: number;
  open: number;
}

export interface CompleteSalesDay extends SalesDay {
  balance: number;
  entry_count: number;
  income: number;
  outcome: number;
}

export interface SalesEntry {
  id: number;
  sales_day_id: number;
  timestamp: string;
  value: number;
}

class DatabaseManager {
  public db: Database;

  constructor(databaseFile = ":memory:") {
    this.db = new Database(databaseFile);
    this.initialize();
  }

  private initialize() {
    const today = getToday();

    this.db.serialize(() => {
      // Create the sales_day table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS "sales_day" (
          "date" TEXT NOT NULL UNIQUE,
          "id" INTEGER PRIMARY KEY AUTOINCREMENT,
          "open" INTEGER NOT NULL DEFAULT 1
        )
      `);

      // Create the sales_entry table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS "sales_entry" (
          "value" REAL NOT NULL,
          "id" INTEGER PRIMARY KEY AUTOINCREMENT,
          "sales_day_id" INTEGER NOT NULL,
          "timestamp" TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY("sales_day_id") REFERENCES "sales_day"("id")
        )
      `);

      // Close all open sales_days
      this.db.run(`UPDATE sales_day SET open = 0 WHERE date != ?`, today);
    });

    console.log("Tables created successfully");
  }

  // public getAllSalesDay(): Promise<SalesDay[]> {
  //   const stmt = this.db.prepare(`
  //     SELECT * FROM sales_day ORDER BY id DESC
  //   `);
  //   return new Promise((res, rej) => {
  //     stmt.all<SalesDay>((err, data) => {
  //       if (err) rej(err);
  //       res(data);
  //     });
  //   });
  // }

  public getSalesDayPageCount(limit: number): Promise<number> {
    const stmt = this.db.prepare(`SELECT COUNT(id) AS count FROM sales_day`);
    return new Promise((res, rej) => {
      stmt.get<{ count: number }>((err, data) => {
        if (err) rej(err);
        res(Math.ceil((data?.count ?? 0) / limit));
      });
    });
  }

  public getPagedCompleteSalesDay(
    limit: number,
    offset: number,
  ): Promise<CompleteSalesDay[]> {
    const stmt = this.db.prepare(`
      SELECT
        sd.id,
        sd.date,
        sd.open,
        COUNT(se.id) AS entry_count,
        SUM(CASE WHEN se.value > 0 THEN se.value ELSE 0 END) AS income,
        SUM(CASE WHEN se.value < 0 THEN se.value ELSE 0 END) AS outcome,
        SUM(se.value) AS balance
      FROM
        sales_day sd
      LEFT JOIN
        sales_entry se ON sd.id = se.sales_day_id
      GROUP BY
        sd.id, sd.date, sd.open
      ORDER BY
        sd.date DESC
      LIMIT ?
      OFFSET ?;
    `);

    return new Promise((res, rej) => {
      stmt.all<CompleteSalesDay>([limit, offset], (err, data) => {
        if (err) rej(err);
        res(data);
      });
    });
  }

  public getSalesDay(date: string): Promise<SalesDay | undefined> {
    const stmt = this.db.prepare(`
      SELECT * FROM sales_day WHERE date = ?
    `);
    return new Promise((res, rej) => {
      stmt.get<SalesDay>(date, (err, data) => {
        if (err) rej(err);
        res(data);
      });
    });
  }

  public async getPagedSalesEntries(
    sales_day: string,
    limit: number,
    offset: number,
  ): Promise<SalesEntry[]> {
    const salesDay = await this.getSalesDay(sales_day);
    if (!salesDay) return [];

    const stmt = this.db.prepare(`
      SELECT * FROM sales_entry WHERE sales_day_id = ? ORDER BY id DESC LIMIT ? OFFSET ?
    `);

    return new Promise((res, rej) => {
      stmt.all<SalesEntry>([salesDay.id, limit, offset], (err, data) => {
        if (err)
          rej(
            new Error(
              "Erro ao buscar movimentação! Por favor, tente novamente.",
            ),
          );
        res(data);
      });
    });
  }

  public async getSalesEntriesPageCount(
    sales_day: string,
    limit: number,
  ): Promise<number> {
    const salesDay = await this.getSalesDay(sales_day);
    if (!salesDay) return 0;

    const stmt = this.db.prepare(
      `SELECT COUNT(id) AS count FROM sales_entry WHERE sales_day_id = ?`,
    );
    return new Promise((res, rej) => {
      stmt.get<{ count: number }>(salesDay.id, (err, data) => {
        if (err) rej(err);
        res(Math.ceil((data?.count ?? 0) / limit));
      });
    });
  }

  public insertSalesDay(date: string, open: 0 | 1 = 1): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO sales_day (date, open) VALUES (?, ?)
    `);
    return new Promise<void>((res, rej) => {
      stmt.run([date, open], (err) => {
        if (err) {
          rej(new Error("Erro ao abrir caixa! Por favor, tente novamente."));
        }
        res();
      });
    });
  }

  public async insertSalesEntry(
    sales_day: string,
    value: number,
  ): Promise<void> {
    const salesDay = await this.getSalesDay(sales_day);
    if (!salesDay) return;
    if (!salesDay.open) throw new Error("Caixa fechado!");

    const stmt = this.db.prepare(`
      INSERT INTO sales_entry (sales_day_id, value) VALUES (?, ?)
    `);

    return new Promise<void>((res, rej) => {
      stmt.run([salesDay.id, value], (err) => {
        if (err) {
          rej(new Error("Erro ao salvar entrada! Por favor, tente novamente."));
        }
        res();
      });
    });
  }

  public async deleteSalesEntry(id: number): Promise<void> {
    const stmt = this.db.prepare(`
      DELETE FROM sales_entry WHERE id = ?
    `);

    return new Promise<void>((res, rej) => {
      stmt.run(id, (err) => {
        if (err) {
          rej(
            new Error(
              "Erro ao deletar movimentação! Por favor, tente novamente.",
            ),
          );
        }
        res();
      });
    });
  }

  public close() {
    this.db.close();
  }
}

export const db = new DatabaseManager("db.sqlite");
