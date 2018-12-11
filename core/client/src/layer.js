import slug from './utils/slug';

const slugs = [];

const ensureUnique = slug => {
  if(slugs.indexOf(slug) > -1){
    let newName = slug;
    let i = 1;
    while(slugs.indexOf(newName) > -1){
      newName = `${slug}-${i}`;
      i = i+1;
    }
  } else {
    return slug;
  }
}

export class Layer {

  constructor(label){
    this.label = label;
    this.slug = ensureUnique(slug(label));
    this.children = [];
    this.GUI = [];
  }

  add(child){
    this.children.push(child);
    return this;
  }

  addTo(layer){
    layer.add(this);
    return this;
  }

  toJSON(mapping){
    const recursiveGenerate = (layer, basePath) => {

      const path = basePath ? `${basePath}.${layer.slug}` : layer.slug;
      if(mapping){
        layer.GUI.map(f =>
          f.controls.map(c => mapping.set(`${path}.${f.slug}.${c.key}`, c))
        );
      }

      return {
        label: layer.label,
        slug: layer.slug,
        path: path,
        children: layer.children.map(c => recursiveGenerate(c, path)),
        controls: layer.GUI.map(f => f.toJSON(path))
      };
    }

    // Get tree in json
    return recursiveGenerate(this);
  }

}
