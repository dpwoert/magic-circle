import Layer from '../src/layer';

describe('core/client:layer', () => {
  test('Layer should be able to get created', () => {
    const layer = new Layer('layer1');

    expect(layer.name).toBe('layer1');
  });

  test('Layer should be able to get added to a parent via addTo()', () => {
    const parent = new Layer('parent');
    const child = new Layer('child').addTo(parent);

    expect(parent.children[0]).toBe(child);
  });

  test('Layer should be able to get added to a parent via add()', () => {
    const parent = new Layer('parent');
    const child = new Layer('child');
    parent.add(child);

    expect(parent.children[0]).toBe(child);
  });

  test('Multiple layers should be able to get added via add()', () => {
    const parent = new Layer('parent');
    const child1 = new Layer('child');
    const child2 = new Layer('child');
    parent.add([child1, child2]);

    expect(parent.children.length).toBe(2);
  });
});
