/**
 * Temporary stub for Parse Server API.
 * Provides a no-op implementation so dynamic imports succeed
 * until a real Parse backend is added.
 */
export default {
  async createList() {
    throw new Error('parseServerApi.createList is not implemented');
  },
};
