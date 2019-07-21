const banner = `
// fix for requiring in electron
if(window.__REQUIRE){
  require = window.__REQUIRE;
}
`;

export default function injectElectron() {
  return {
    name: 'inject-electron', // this name will show up in warnings and errors
    banner() {
      return banner;
    },
  };
}
