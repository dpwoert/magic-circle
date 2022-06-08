import { select } from 'd3-selection';

// breaks into multiple lines with a delimiter
export function insertLinebreaks(d: any) {
  const el = select(this);
  const words = d.properties.Label.split(' | ');
  el.text('');

  for (let i = 0; i < words.length; i += 1) {
    const tspan = el.append('tspan').text(words[i]);
    if (i > 0) {
      tspan.attr('x', 0).attr('dy', '13');
    }
  }
}
