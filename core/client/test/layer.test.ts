import Layer from '../src/layer';

describe('core/client:layer', () => {
  test('Layer should be able to get created', () => {
    const layer = new Layer('layer1');
    expect(layer.name).toBe('layer1');
  });

  test('Layer should be able to get added to a parent via addTo()', () => {
    const parent = new Layer('parent');
    const child = new Layer('child').addTo(parent);
    expect(parent.children[0]).toBeDefined();
    expect(parent.children[0] === child).toBe(true);
    expect(child.parent).toBe(parent);
  });

  /*
  test('Layer should be able to get added to a parent via add()', () => {
    const parent = new Layer('parent');
    const child = new Layer('child');
    parent.add(child);
    expect(parent.children[0]).toBe(child);
    expect(child.parent).toBe(parent);
  });

  test('Multiple layers should be able to get added via add()', () => {
    const parent = new Layer('parent');
    const child1 = new Layer('child');
    const child2 = new Layer('child');
    parent.add([child1, child2]);
    expect(parent.children.length).toBe(2);
    expect(child1.parent).toBe(parent);
    expect(child2.parent).toBe(parent);
  });

  test('Should not add duplicate layers via add()', () => {
    const parent = new Layer('parent');
    const child = new Layer('child');
    parent.add([child, child, child]);
    expect(parent.children.length).toBe(1);
  });

  test('Should be able to add and remove layer', () => {
    const parent = new Layer('parent');
    const child = new Layer('child');
    parent.add(child);
    expect(parent.children.length).toBe(1);
    expect(child.parent).toBe(parent);
    parent.remove(child);
    expect(parent.children.length).toBe(0);
    expect(child.parent).toBeNull();
  });

  test('Should be able to add and remove multiple layers', () => {
    const parent = new Layer('parent');
    const child1 = new Layer('child 1');
    const child2 = new Layer('child 2');
    parent.add([child1, child2]);
    expect(parent.children.length).toBe(2);
    parent.remove([child1, child2]);
    expect(parent.children.length).toBe(0);
  });
  */
});
