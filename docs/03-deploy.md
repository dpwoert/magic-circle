# Deploy

It is possible to create a static distribution of the UI that can be deployed to wherever (for example via CI/CD) by running the following command:

```sh
$ npx magic build
```

After building is completed the bundle will be available in the `magic-circle` folder. If needed this folder can be changed as well. Also the base path can be changed if `/` isn't correct.

```sh
# Build to custom folder
$ npx magic build --output "folderName"

# Set a different base path
$ npx magic build --base "/magic-circle"
```

## Different URL for deployments

If you have a different url for deployments, then locally you can make the URL in your config file (`magic.config.js`) dynamic:

```js
export default {
  // Url dependendent on building locally (dev = true) or build for deployment
  url: (dev) =>
    dev ? 'http://localhost:4000' : 'https://website.com/visualistion',
};
```

## Deploy as a subfolder inside your own build

You might want to make Magic Circle part of your own build and serve it from a subfolder like `https://yoururl.com/magic-circle`. To do this create a build script like so:

```sh
magic build --base "/folderName" --output "/folderName"
```

Now it will output Magic Circle to the folder of your chosing and makes sure the base path of Magic Circle is set to your subfolder instead of the root (`/`) folder.

Now you need to deploy this via your own process.

## Deploy to services

To deploy to a service it is probably be best to add magic circle scripts to your package.json so you can run it via NPM (which might be needed for some services).

```json
{
  "scripts": {
    "magic:serve": "magic",
    "magic:build": "magic build"
  }
}
```

Now you can run the local version with `npm run magic:serve` and create a build with `npm run magic:build`.

### Surge

For full documentation about Surge, read their own docs [here](https://surge.sh/help/). To make this work with Magic Circle you could change your package.json like this:

```json
{
  "scripts": {
    "magic:serve": "magic",
    "magic:build": "magic build",
    "magic:deploy": "npm run magic:build && surge --project ./magic-circle"
  }
}
```

Now you can build & deploy Magic Circle by running `npm run magic:deploy`. This will only deploy Magic Circle, not your own project. You will have to deploy your own project seperatly.
