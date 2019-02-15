# AppDev Core JavaScript Libraries

This is an NPM package in which we store our shared JavaScript code. These abstractions are usually common to all our JavaScript backends.

* AppDevRouter - an abstraction for Express routers
* AppDevAPI - an abstraction of an Express web API
* ChronicleSession - an abstraction of the Chronicle logging tool
* RegisterSession - an abstraction of the Register tool

## Install

To install the latest version of this package into your Node.js project, run the following in the root of your project
```
npm install git+https://github.com/cuappdev/appdev.js.git
```

## Build

To build, run the following:

```
npm install
npm run build
```

This will build the latest version of the library. You can `npm link` this library globally, and then test its functionality in other Node.js projects by linking the package (`npm link appdev`).
