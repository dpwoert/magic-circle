import Paths from '../src/paths';

describe('core/client:paths', () => {
  test('All paths should be unique', () => {
    const paths = new Paths();

    expect(paths.get('base', 'test')).toBe('base.test');
    expect(paths.get('base', 'test')).toBe('base.test_2');
    expect(paths.get('base', 'test')).toBe('base.test_3');
  });

  test('Path should be correct if base not given', () => {
    const paths = new Paths();
    expect(paths.get('', 'test')).toBe('test');
  });
});
