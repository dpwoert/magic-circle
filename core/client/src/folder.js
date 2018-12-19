import slug from './utils/slug';

export class Folder {

  constructor(parent, label, ...controls){
    this.controls = [];
    this.slug = slug(label);
    this.label = label;

    //Add to parent
    parent.GUI = parent.GUI || [];
    parent.GUI.push(this);

    if(controls.length > 0){
      this.addControls(controls);
    }
  }

  addControls(controls){
    controls.forEach((c) => this.addControl(c));
  }

  addControl(control){
    this.controls.push(control);
  }

  toJSON(basePath){
    const path = `${basePath}.${this.slug}`;
    return {
      path,
      isFolder: true,
      slug: this.slug,
      label: this.label,
      controls: this.controls.map(c => c.toJSON(path))
    };
  }

}
