# Blocks Skeleton (Aurelia CLI build - TypeScript)

## Running The App

To run the app, follow these steps:

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. 'cd' to the BLOCKS project folder located in the root of Www: 'Scripts/Calculators/Blocks/', execute the following command:

  ```shell
  git clone https://github.com/nthompson777/BlocksSkeleton
  ```
3. Rename the 'BlocksSkeleton' folder that you just cloned to the name of the new Block then run the following command:

  ```shell
  npm install
  ```
4. To run the app, execute the following command:

  ```shell
  au run
  ```
  >**Note:** The 'au run' command builds and runs the app while running BrowserSync to watch for .ts, .html, and .scss file changes and auto-refreshes the browser.

5. Browse to [http://localhost:9000](http://localhost:9000) to see the app. You can make changes in the code found under `src` and the browser should auto-refresh itself as you save files.

> This starter kit/skeleton uses [BrowserSync](http://www.browsersync.io/) for automated page refreshes on code/markup changes concurrently across multiple browsers. If you prefer to disable the mirroring feature set the [ghostMode option](http://www.browsersync.io/docs/options/#option-ghostMode) to false


## Building
Building the app is performed with the Aurelia CLI:

  ```shell
    au build
  ```

## Gulp Tasks
You can also analyze your Sass files using the command bellow:

  ```shell
    gulp analyze-scss
  ```

## Running The Unit Tests

To run the unit tests, first ensure that you have followed the steps above in order to install all dependencies and successfully build the library. Once you have done that, proceed with these additional steps:

1. Ensure that the [Karma](http://karma-runner.github.io/) CLI is installed. If you need to install it, use the following command:

  ```shell
  npm install -g karma-cli
  ```
2. Install Aurelia libs for test visibility:

```shell
jspm install aurelia-framework
jspm install aurelia-http-client
jspm install aurelia-router
```
3. You can now run the tests with this command:

  ```shell
  karma start
  ```

## Running The E2E Tests
Integration tests are performed with [Protractor](http://angular.github.io/protractor/#/).

1. Place your E2E-Tests into the folder ```test/e2e/src```
2. Install the necessary webdriver

  ```shell
  au webdriver-update
  ```

3. Configure the path to the webdriver by opening the file ```protractor.conf.js``` and adjusting the ```seleniumServerJar``` property. Typically its only needed to adjust the version number.

4. Make sure your app runs and is accessible

  ```shell
  au watch
  ```

5. In another console run the E2E-Tests

  ```shell
  au e2e
  ```

#### Configuration
The configuration is done by ```bundles.js``` file.
In addition, ```export.js``` file is available for including individual files.
