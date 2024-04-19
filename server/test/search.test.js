const {toRadians, computeDistance, computeScore} = require('../controllers/searchController');

describe('test toRadians', () => {
    test('convert degrees to radians', () => {
        expect(toRadians(0)).toBe(0);
        expect(toRadians(45)).toBe(Math.PI / 4);
        expect(toRadians(90)).toBeCloseTo(Math.PI / 2);
        expect(toRadians(135)).toBe(Math.PI * 3 / 4);
        expect(toRadians(180)).toBeCloseTo(Math.PI);

        expect(toRadians(-45)).toBe(-Math.PI / 4);
        expect(toRadians(-90)).toBeCloseTo(-Math.PI / 2);
        expect(toRadians(-135)).toBe(-Math.PI * 3 / 4);
        expect(toRadians(-180)).toBeCloseTo(-Math.PI);
    });
});

describe('test compute distance', () => {
    test('test integer', () => {
        const lat1 = -64.756;
        const lon1 = 53.220;
        const lat2 = -61;
        const lon2 = 52;
        const expectedDistance = 422.182;

        const distance = computeDistance(lat1, lon1, lat2, lon2);
        
        expect(distance).toBeCloseTo(expectedDistance, 3);
    });

    test('test float with 3 decimal places', () => {
        const lat1 = -64.756;
        const lon1 = 53.220;
        const lat2 = -61.246;
        const lon2 = 52.368;
        const expectedDistance = 392.647;

        const distance = computeDistance(lat1, lon1, lat2, lon2);
        
        expect(distance).toBeCloseTo(expectedDistance, 3);
    });

    test('test float with more than 3 decimal places', () => {
        const lat1 = -64.756;
        const lon1 = 53.220;
        const lat2 = -61.24622;
        const lon2 = 52.36812;
        const expectedDistance = 392.622;

        const distance = computeDistance(lat1, lon1, lat2, lon2);
        
        expect(distance).toBeCloseTo(expectedDistance, 3);
    });
});

describe('test compute score', () => {
    test('test distance exceed limit', () => {
        const lat1 = -64.756;
        const lon1 = 53.220;
        const lat2 = -61;
        const lon2 = 52;
        const location = {'latitude': lat1, 'longitude': lon1};
        const limit = 400;

        const expectedScore = 0.0;

        const score = computeScore(location, lat2, lon2, limit);
        
        expect(score).toBe(expectedScore);
    });

    test('test distance within limit 400', () => {

        const lat1 = -64.756;
        const lon1 = 53.220;
        const lat2 = -64.246;
        const lon2 = 52.368;
        const location = {latitude: lat1, longitude: lon1};
        const limit = 400;

        const expectedScore = 0.8;

        const score = computeScore(location, lat2, lon2, limit);
        
        expect(score).toBe(expectedScore);

    });

    test('test distance within limit 1000', () => {
        const lat1 = -64.756;
        const lon1 = 53.220;
        const lat2 = -64.246;
        const lon2 = 52.368;
        const location = {latitude: lat1, longitude: lon1};
        const limit = 1000;

        const expectedScore = 0.9;

        const score = computeScore(location, lat2, lon2, limit);
        
        expect(score).toBe(expectedScore);

    });
});