import { TolowerMiddleware } from './tolower.middleware';

describe('TolowerMiddleware', () => {
  it('should be defined', () => {
    expect(new TolowerMiddleware()).toBeDefined();
  });
});
