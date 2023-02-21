import { <%= classify(name) %> Controller } from './<%= name %>.controller';

describe('<%= classify(name) %> Controller', () => {
  let controller;

  beforeEach(async () => {
      controller = new (<%= classify(name) %>Controller());
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
});
});
