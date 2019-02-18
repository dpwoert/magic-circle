#!/bin/bash
find . -name "*.svg" -print0 | xargs -0 -I{} svgexport {} {}.png pad -8:-8:40:40 256:256 "svg{fill: white}"
find . -name "*.svg.png" -print0 | sed 's/.svg.png//g' | xargs -0 -I{} mv {}.svg.png {}.png
