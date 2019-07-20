const fs = require('fs');

const build = async build => {
  console.log(build);
};

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
      if (isWrite) {
        const txt = fs.readFileSync(file, 'utf8');
        const converted = `

          // fix for requiring in electron
          if(window.__REQUIRE){
            require = window.__REQUIRE;
          }

          ${txt}
        `;

        // this is stupid, need to improve this later
        setTimeout(() => fs.writeFileSync(file, converted), 200);
      }
    },
  };
}
