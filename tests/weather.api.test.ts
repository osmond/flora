import { describe, it, expect, vi } from 'vitest';
import { GET } from '../src/app/api/weather/route';

// Helper to create Response-like object for fetch spy
function mockFetch(jsonData: any) {
  return {
    ok: true,
    json: async () => jsonData,
  } as any;
}

describe('GET /api/weather', () => {
  it('caches responses for identical coords', async () => {
    const mockData = {
      daily: {
        time: ['2024-01-01'],
        temperature_2m_max: [20],
        temperature_2m_min: [10],
        precipitation_probability_max: [50],
      },
    };
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(mockFetch(mockData));

    const req = new Request('http://localhost/api/weather?lat=1&lon=2');
    const res1 = await GET(req);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const json1 = await res1.json();
    expect(json1[0].tempMax).toBe(20);

    const res2 = await GET(req);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const json2 = await res2.json();
    expect(json2).toEqual(json1);

    fetchSpy.mockRestore();
  });
});
