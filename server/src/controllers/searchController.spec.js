const { Op } = require('sequelize');
const { searchLocation } = require('./searchController');
const Geolocation = require('../models/geolocationModel');
const redisClient = require('../repository/cacheConnection');

jest.mock('../models/geolocationModel');


const resMock = () => {
  const res = {};
  res.send = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};
const geoLocationFindAllSpy = jest.spyOn(Geolocation, 'findAll');
const redisExistsSpy = jest.spyOn(redisClient, 'exists');
const redisGetSpy = jest.spyOn(redisClient, 'get');
const redisSetSpy = jest.spyOn(redisClient, 'set');

const resultSample1 = {
  street: 'Bay',
  city: 'Toronto',
  county: 'ON',
  country: 'Canada',
};

beforeAll(async () => {
  await redisClient.connect();
});

afterAll(async () => {
  await redisClient.quit();
})

beforeEach(() => {
  jest.resetAllMocks();
});

describe('SearchController test', () => {
  it('Sends empty suggestions when no results are found', async () => {
    const req = {
      query: {
        q: 'testInput',
        latitude: 111,
        longtitude: 111,
      },
    };

    geoLocationFindAllSpy.mockResolvedValueOnce([]);
    const res = resMock();
    await searchLocation(req, res);

    expect(redisExistsSpy).toHaveBeenCalledWith(req.query.q);
    expect(geoLocationFindAllSpy).toHaveBeenCalledWith({
      where: {
        street: {
          [Op.substring]: req.query.q,
        }
      }
    });
    expect(res.send).toHaveBeenCalledWith({ 'suggestions': [] });
  });

  it('Gets matched results from db on cache miss in redis and caches the result', async () => {
    const req = {
      query: {
        q: 'bay',
        latitude: 111,
        longtitude: 111,
      },
    };

    geoLocationFindAllSpy.mockResolvedValueOnce([resultSample1]);
    const res = resMock();
    await searchLocation(req, res);
    expect(redisExistsSpy).toHaveBeenCalledWith(req.query.q);
    expect(geoLocationFindAllSpy).toHaveBeenCalledWith({
      where: {
        street: {
          [Op.substring]: req.query.q,
        }
      }
    });
    expect(redisSetSpy).toHaveBeenCalledWith('bay', JSON.stringify([resultSample1]));
  });

  it('Gets matched results from redis on cache hit', async () => {
    const req = {
      query: {
        q: 'bay',
        latitude: 111,
        longtitude: 111,
      },
    };
    redisExistsSpy.mockResolvedValueOnce(true);
    redisGetSpy.mockResolvedValueOnce(JSON.stringify([resultSample1]));
    const res = resMock();
    await searchLocation(req, res);
    expect(redisExistsSpy).toHaveBeenCalledWith(req.query.q);
    expect(redisGetSpy).toHaveBeenCalledWith(req.query.q);
    expect(geoLocationFindAllSpy).not.toHaveBeenCalled();
  });
});
