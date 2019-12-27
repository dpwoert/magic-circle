import slug from './utils/slug';

const slugs = [];

const ensureUnique = str => {
  if (slugs.indexOf(str) > -1) {
    let newName = str;
    let i = 1;
    while (slugs.indexOf(newName) > -1) {
      newName = `${str}-${i}`;
      i += 1;
    }
    return newName;
  }

  return str;
};

export class Layer {
  constructor(label, controls = []) {
    this.label = label;
    this.slug = ensureUnique(slug(label));
    this.children = [];
    this.controls = controls;
    this.isLayer = true;
    this.isFolder = false;
    this.disabled = false;
  }

  add(child) {
    if (Array.isArray(child)) {
      child.forEach(c => this.add(c));
    } else if (child.reference) {
      this.controls.push(child);
    } else {
      this.children.push(child);
    }
    return this;
  }

  addTo(layer) {
    layer.add(this);
    return this;
  }

  layer(...opts) {
    return new Layer(...opts).addTo(this);
  }

  folder(...opts) {
    // needs this weird constructor due to circular referencing
    const folder = new Layer.__Folder(...opts); //eslint-disable-line
    this.add(folder);
    return folder;
  }

  toJSON(mapping) {
    const recursiveGenerate = (layer, basePath) => {
      const path = basePath ? `${basePath}.${layer.slug}` : layer.slug;

      if (mapping) {
        layer.controls.forEach(c => mapping.set(`${path}.${c.key}`, c));
      }

      return {
        isLayer: layer.isLayer,
        isFolder: layer.isFolder,
        label: layer.label,
        slug: layer.slug,
        path,
        children: layer.children
          ? layer.children.map(c => recursiveGenerate(c, path))
          : [],
        controls: layer.controls.map(f => f.toJSON(path)),
      };
    };

    // Get tree in json
    return recursiveGenerate(this);
  }
}
