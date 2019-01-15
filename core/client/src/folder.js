import slug from './utils/slug';

export class Folder {
  constructor(label, ...controls) {
    this.controls = [];
    this.slug = slug(label);
    this.label = label;

    if (controls.length > 0) {
      this.addControls(controls);
    }
  }

  addControls(controls) {
    controls.forEach(c => this.addControl(c));
    return this;
  }

  addControl(control) {
    this.controls.push(control);
    return this;
  }

  addTo(layer) {
    layer.addControl(layer);
    return this;
  }

  toJSON(basePath) {
    const path = `${basePath}.${this.slug}`;
    return {
      path,
      isFolder: true,
      slug: this.slug,
      label: this.label,
      controls: this.controls.map(c => c.toJSON(path)),
    };
  }
}
