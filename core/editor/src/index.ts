import App from '@magic-circle/ui';

import { Config, UserConfig } from './schema';
import defaultConfig from './default-config';

export default function build(userConf: UserConfig) {
  // merge with default config
  const config: Config = { ...defaultConfig, ...userConf };

  console.log({ App });
}

//this file has to be converted with rollup + TS
