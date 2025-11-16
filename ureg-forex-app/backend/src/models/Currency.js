// C:\Users\honjm\U-Reg Coding Challenge\ureg-forex-app\backend\src\models\Currency.js
const db = require('../config/database');

class Currency {
  static async getAllCurrencies() {
    const query = 'SELECT id, code, name FROM currencies ORDER BY id DESC';
    const result = await db.query(query);
    return result.rows;
  }

  static async getCurrencyById(id) {
    const query = 'SELECT id, code, name FROM currencies WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getCurrencyByCode(code) {
    const query = 'SELECT id, code, name FROM currencies WHERE code = $1';
    const result = await db.query(query, [code]);
    return result.rows[0];
  }

  static async createCurrency(code, name) {
    const query = 'INSERT INTO currencies (code, name) VALUES ($1, $2) RETURNING id, code, name';
    const result = await db.query(query, [code, name]);
    return result.rows[0];
  }

  static async updateCurrency(id, code, name) {
    const query = 'UPDATE currencies SET code = $2, name = $3 WHERE id = $1 RETURNING id, code, name';
    const result = await db.query(query, [id, code, name]);
    return result.rows[0];
  }

  static async deleteCurrency(id) {
    // Check if currency is referenced in rates table before deletion
    const checkQuery = `
      SELECT 1 FROM rates 
      WHERE base_currency_id = $1 OR target_currency_id = $1 
      LIMIT 1
    `;
    const checkResult = await db.query(checkQuery, [id]);
    
    if (checkResult.rows.length > 0) {
      throw new Error('Cannot delete currency: it is referenced in exchange rates');
    }
    
    const query = 'DELETE FROM currencies WHERE id = $1 RETURNING id, code, name';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Currency;