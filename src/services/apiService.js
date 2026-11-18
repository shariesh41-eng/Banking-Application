/**
 * Simulated Async API Client with Realistic Fintech Latency
 */

const SIMULATED_DELAY_MS = 250;

export const apiService = {
  /**
   * Simulates an async request
   * @param {Function} dataFn
   * @param {number} delay
   * @returns {Promise}
   */
  async request(dataFn, delay = SIMULATED_DELAY_MS) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = dataFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  },
};
