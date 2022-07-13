# Controls

_This documentation is about the default bundled controls, custom controls might differ in behaviour._

## Generic

All controls share the current functions and all functions are chainable.

```js
// Never use the control base class (except when creating your own custom control), this is just to explain the shared functionality
import { Control } from '@magic-circle/client';

const object = {
  property: 'test',
};

// Creates new control, and sets the reference to a variable in the constructor
// The first argument needs to be an object, while the second one is a property to read
// This uses the way Javascript works with references ("Pass by reference").
const control = new Control(object, 'property')

  // Sets label inside UI, if no label is given the property name is used
  .label('Example')

  // Watch this control, for example when you have some logic whereby this control might change over time outside of the UI
  .watch()
  .watch(true)
  .watch(false);

// Sets the current value as being the default value
// This will automatically get done on magic circle start
control.setDefault();
// Resets control to initial value
control.reset();
```

## Numbers

```js
import { NumberControl } from '@magic-circle/client';
const control = new NumberControl(mesh.position, 'x')
  // Will display a slider between the two values (optional)
  .range(-200, 200)
  // The accuracy of the slider or stepper (optional)
  .stepSize(1);
```

## Text

```js
import { TextControl } from '@magic-circle/client';
const control = new TextControl(object, 'name')
  // Will display a selection box
  // Optional, if not given it will display a textbox
  .selection(['option 1', 'option 2'])

  // Its also possible to give a second arguments with labels
  .selection(['1', '2'], ['Option 1', 'Option 2']);
```

## Colors

```js
import { ColorControl } from '@magic-circle/client';

// Examples of possible ways of inputting colours
const color = '#ff0000';
const color = 'rgb(255, 0, 0)';
const color = 'rgb(255, 0, 0, 1)';
const color = [255, 0, 0];
const color = [255, 0, 0, 1];
const color = { r: 255, g: 0, b: 0 };
const color = { r: 255, g: 0, b: 0, a: 255 };
const color = { red: 255, green: 0, blue: 0 };
const color = { red: 255, green: 0, blue: 0, alpha: 100 };

const control = new ColorControl(material, 'color')
  // Sets to use the alpha channel
  .alpha()
  .alpha(true)
  .alpha(false)

  // When using objects or arrays this will set the range size
  // For example three.js colors have a range between 0-1
  .range(255)
  .range(1)

  // The second argument is for the alpha channel, which can sometimes differ
  .range(255, 1);
```

## Boolean

```js
import { BooleanControl } from '@magic-circle/client';
const control = new BooleanControl(object, 'flag');
```

## Functions/buttons

```js
import { ButtonControl } from '@magic-circle/client';
const control = new ButtonControl(object, 'fn');
```
