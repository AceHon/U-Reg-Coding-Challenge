const rateController = require('../controllers/rateController');
const Rate = require('../models/Rate');

// Mock the Rate model
jest.mock('../models/Rate');

describe('Rate Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getLatestRates', () => {
    it('should return latest rates successfully', async () => {
      const mockRates = [
        { base_currency_code: 'USD', target_currency_code: 'EUR', rate: 0.85 }
      ];
      Rate.getLatestRates.mockResolvedValue(mockRates);

      await rateController.getLatestRates(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
         mockRates
      });
    });

    it('should handle errors', async () => {
      Rate.getLatestRates.mockRejectedValue(new Error('Database error'));

      await rateController.getLatestRates(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error fetching latest rates'
      });
    });
  });

  describe('getHistoricalRates', () => {
    it('should return historical rates for valid date', async () => {
      req.query = { date: '2023-07-01' };
      const mockRates = [
        { base_currency_code: 'USD', target_currency_code: 'EUR', rate: 0.81 }
      ];
      Rate.getHistoricalRates.mockResolvedValue(mockRates);

      await rateController.getHistoricalRates(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
         mockRates
      });
    });

    it('should return 400 for invalid date format', async () => {
      req.query = { date: 'invalid-date' };

      await rateController.getHistoricalRates(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    });
  });
});