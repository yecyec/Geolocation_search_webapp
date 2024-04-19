const {
  degreestoRadians,
  computeDistance,
  computeScoreByDistance,
  computeScoreByMatchedProportion,
} = require('./computeScore');

describe('test degreestoRadians', () => {
  it('convert degrees to radians', () => {
    expect(degreestoRadians(0)).toBe(0);
    expect(degreestoRadians(45)).toBe(Math.PI / 4);
    expect(degreestoRadians(90)).toBeCloseTo(Math.PI / 2);
    expect(degreestoRadians(135)).toBe(Math.PI * 3 / 4);
    expect(degreestoRadians(180)).toBeCloseTo(Math.PI);

    expect(degreestoRadians(-45)).toBe(-Math.PI / 4);
    expect(degreestoRadians(-90)).toBeCloseTo(-Math.PI / 2);
    expect(degreestoRadians(-135)).toBe(-Math.PI * 3 / 4);
    expect(degreestoRadians(-180)).toBeCloseTo(-Math.PI);
  });
});

describe('test computeDistance', () => {
  it('test integer', () => {
    const lat1 = -64.756;
    const lon1 = 53.220;
    const lat2 = -61;
    const lon2 = 52;

    const expectedDistance = 422.182;
    const distance = computeDistance(lat1, lon1, lat2, lon2);
    expect(distance).toBeCloseTo(expectedDistance, 3);
  });

  it('test float with 3 decimal places', () => {
    const lat1 = -64.756;
    const lon1 = 53.220;
    const lat2 = -61.246;
    const lon2 = 52.368;

    const expectedDistance = 392.647;
    const distance = computeDistance(lat1, lon1, lat2, lon2);
    expect(distance).toBeCloseTo(expectedDistance, 3);
  });

  it('test float with more than 3 decimal places', () => {
    const lat1 = -64.756;
    const lon1 = 53.220;
    const lat2 = -61.24622;
    const lon2 = 52.36812;

    const expectedDistance = 392.622;
    const distance = computeDistance(lat1, lon1, lat2, lon2);
    expect(distance).toBeCloseTo(expectedDistance, 3);
  });
});

describe('test computeScoreByDistance', () => {
  it('test distance exceed limit', () => {
    const lat1 = -64.756;
    const lon1 = 53.220;
    const lat2 = -61;
    const lon2 = 52;
    const location = { 'latitude': lat1, 'longitude': lon1 };
    const limit = 400;

    const expectedScore = 0.0;
    const score = computeScoreByDistance(location, lat2, lon2, limit);
    expect(score).toBe(expectedScore);
  });

  it('test distance within limit 400', () => {
    const lat1 = -64.756;
    const lon1 = 53.220;
    const lat2 = -64.246;
    const lon2 = 52.368;
    const location = { latitude: lat1, longitude: lon1 };
    const limit = 400;

    const expectedScore = 0.8;
    const score = computeScoreByDistance(location, lat2, lon2, limit);
    expect(score).toBe(expectedScore);

  });

  it('test distance within limit 1000', () => {
    const lat1 = -64.756;
    const lon1 = 53.220;
    const lat2 = -64.246;
    const lon2 = 52.368;
    const location = { latitude: lat1, longitude: lon1 };
    const limit = 1000;

    const expectedScore = 0.9;
    const score = computeScoreByDistance(location, lat2, lon2, limit);
    expect(score).toBe(expectedScore);
  });
});

describe('test computeScoreByMatchedProportion', () => {
  it('returns the expected score', () => {
    expect(computeScoreByMatchedProportion(1, 5)).toBe(0.2);
    expect(computeScoreByMatchedProportion(0, 5)).toBe(0);
    expect(computeScoreByMatchedProportion(0, 0)).toBe(0);
    expect(computeScoreByMatchedProportion(5, 5)).toBe(1);
    expect(computeScoreByMatchedProportion(6, 5)).toBe(1);
  });
});
