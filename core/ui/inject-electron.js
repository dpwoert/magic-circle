const fs = require('fs');

const build = async build => {
  console.log(build);
};

const files = [];

export default function injectElectron() {
  return {
    name: 'inject-electron', // this name will show up in warnings and errors
    // writeBundle(bundle){
    //   console.log('write bundle', bundle);
    // },
    // generateBundle(options, bundle){
    //   console.log('generate bundle', options);
    //   console.log(bundle)
    // }

    async generateBundle({ file }, _, isWrite) {
      files.push(file);
    },

    async writeBundle(output) {
      const bundles = Object.values(output);

      bundles.forEach(bundle => {
        const path = files.find(file => file.endsWith(bundle.fileName));

        const txt = fs.readFileSync(path, 'utf8');
        const converted = `

          // fix for requiring in electron
          if(window.__REQUIRE){
            require = window.__REQUIRE;
          }

          ${txt}
        `;

        // this is stupid, need to improve this later
        fs.writeFileSync(path, converted);
      });
    },
  };
}
