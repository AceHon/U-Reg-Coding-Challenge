const db = require('../config/database');
const Currency = require('./Currency'); // Import the Currency model

class Rate {
  // ---------------------------------------------
  // Get latest rates using Asia/Kuala_Lumpur timezone
  // ---------------------------------------------
  static async getLatestRates() {
    const query = `
      SELECT 
        c1.code AS base_currency_code,
        c2.code AS target_currency_code,
        r.rate,
        r.effective_date
      FROM rates r
      JOIN currencies c1 ON r.base_currency_id = c1.id
      JOIN currencies c2 ON r.target_currency_id = c2.id
      WHERE r.effective_date = (
        SELECT MAX(effective_date)
        FROM rates
        WHERE effective_date <= (NOW() AT TIME ZONE 'Asia/Kuala_Lumpur')::date
      )
      ORDER BY c1.code, c2.code
    `;
    const result = await db.query(query);
    return result.rows;
  }

  // ---------------------------------------------
  // Get historical rates for a specific date
  // ---------------------------------------------
  static async getHistoricalRates(date) {
    const query = `
      SELECT 
        c1.code AS base_currency_code,
        c2.code AS target_currency_code,
        r.rate,
        r.effective_date
      FROM rates r
      JOIN currencies c1 ON r.base_currency_id = c1.id
      JOIN currencies c2 ON r.target_currency_id = c2.id
      WHERE r.effective_date = $1
      ORDER BY c1.code, c2.code
    `;
    const result = await db.query(query, [date]);
    return result.rows;
  }

  // ---------------------------------------------
  // Paginated rates (latest or historical + optional base currency)
  // ---------------------------------------------
  static async getPaginatedRates(date = null, baseCurrency = null, offset = 0, limit = 15) {
    let query;
    let params = [limit, offset];

    if (date && date !== 'null') {
      // Historical with base currency
      if (baseCurrency && baseCurrency !== '') {
        query = `
          SELECT 
            c1.code AS base_currency_code,
            c2.code AS target_currency_code,
            r.rate,
            r.effective_date
          FROM rates r
          JOIN currencies c1 ON r.base_currency_id = c1.id
          JOIN currencies c2 ON r.target_currency_id = c2.id
          WHERE r.effective_date = $3 AND c1.code = $4
          ORDER BY c1.code, c2.code
          LIMIT $1 OFFSET $2
        `;
        params = [limit, offset, date, baseCurrency];
      } else {
        // Historical without base currency
        query = `
          SELECT 
            c1.code AS base_currency_code,
            c2.code AS target_currency_code,
            r.rate,
            r.effective_date
          FROM rates r
          JOIN currencies c1 ON r.base_currency_id = c1.id
          JOIN currencies c2 ON r.target_currency_id = c2.id
          WHERE r.effective_date = $3
          ORDER BY c1.code, c2.code
          LIMIT $1 OFFSET $2
        `;
        params = [limit, offset, date];
      }
    } else {
      // Latest with base currency
      if (baseCurrency && baseCurrency !== '') {
        query = `
          SELECT 
            c1.code AS base_currency_code,
            c2.code AS target_currency_code,
            r.rate,
            r.effective_date
          FROM rates r
          JOIN currencies c1 ON r.base_currency_id = c1.id
          JOIN currencies c2 ON r.target_currency_id = c2.id
          WHERE r.effective_date = (
            SELECT MAX(effective_date)
            FROM rates
            WHERE effective_date <= (NOW() AT TIME ZONE 'Asia/Kuala_Lumpur')::date
          ) AND c1.code = $3
          ORDER BY c1.code, c2.code
          LIMIT $1 OFFSET $2
        `;
        params = [limit, offset, baseCurrency];
      } else {
        // Latest without base currency
        query = `
          SELECT 
            c1.code AS base_currency_code,
            c2.code AS target_currency_code,
            r.rate,
            r.effective_date
          FROM rates r
          JOIN currencies c1 ON r.base_currency_id = c1.id
          JOIN currencies c2 ON r.target_currency_id = c2.id
          WHERE r.effective_date = (
            SELECT MAX(effective_date)
            FROM rates
            WHERE effective_date <= (NOW() AT TIME ZONE 'Asia/Kuala_Lumpur')::date
          )
          ORDER BY c1.code, c2.code
          LIMIT $1 OFFSET $2
        `;
      }
    }

    const result = await db.query(query, params);
    return result.rows;
  }

  // ---------------------------------------------
  // Update an existing rate
  // ---------------------------------------------
  static async updateRate(id, baseCurrencyCode, targetCurrencyCode, rate, effectiveDate) {
    const baseCurrency = await Currency.getCurrencyByCode(baseCurrencyCode);
    const targetCurrency = await Currency.getCurrencyByCode(targetCurrencyCode);

    if (!baseCurrency) throw new Error(`Base currency with code ${baseCurrencyCode} does not exist`);
    if (!targetCurrency) throw new Error(`Target currency with code ${targetCurrencyCode} does not exist`);

    const query = `
      UPDATE rates 
      SET base_currency_id = $2,
          target_currency_id = $3,
          rate = $4,
          effective_date = $5
      WHERE id = $1
      RETURNING id, base_currency_id, target_currency_id, rate, effective_date
    `;
    const result = await db.query(query, [id, baseCurrency.id, targetCurrency.id, rate, effectiveDate]);
    return result.rows[0];
  }

  // ---------------------------------------------
  // Create a new rate
  // ---------------------------------------------
  static async createRate(baseCurrencyCode, targetCurrencyCode, rate, effectiveDate) {
    const baseCurrency = await Currency.getCurrencyByCode(baseCurrencyCode);
    const targetCurrency = await Currency.getCurrencyByCode(targetCurrencyCode);

    if (!baseCurrency) throw new Error(`Base currency with code ${baseCurrencyCode} does not exist`);
    if (!targetCurrency) throw new Error(`Target currency with code ${targetCurrencyCode} does not exist`);

    const query = `
      INSERT INTO rates (base_currency_id, target_currency_id, rate, effective_date)
      VALUES ($1, $2, $3, $4)
      RETURNING id, base_currency_id, target_currency_id, rate, effective_date
    `;
    const result = await db.query(query, [baseCurrency.id, targetCurrency.id, rate, effectiveDate]);
    return result.rows[0];
  }

  static async getAllRates() {
    const query = `
      SELECT 
        r.id,
        c1.code AS base_currency_code,
        c2.code AS target_currency_code,
        r.rate,
        r.effective_date
      FROM rates r
      JOIN currencies c1 ON r.base_currency_id = c1.id
      JOIN currencies c2 ON r.target_currency_id = c2.id
      ORDER BY r.effective_date DESC;
    `;
    return db.query(query);
  }

  // ---------------------------------------------
  // Delete a rate by ID
  // ---------------------------------------------
  static async deleteRate(id) {
    const query = `DELETE FROM rates WHERE id = $1 RETURNING id`;
    const result = await db.query(query, [id]);
    return result.rows[0]; // will return deleted row id
  }

}

module.exports = Rate;
