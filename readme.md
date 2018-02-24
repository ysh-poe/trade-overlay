# Trade Overlay for Path of Exile
## Introduction
The goal of this application is to simplify trading in the game Path of Exile. 
## Installing for development
Requirements:
* [Node.js 8.9.4](https://nodejs.org/en/)
* [Node-gyp](https://github.com/nodejs/node-gyp#installation)

Clone this github repository
```
git clone https://github.com/ysh-poe/trade-overlay.git
```
Install it with ```npm```
```
npm install
```
This application uses Native Node Modules and those have to be built them against [the electron headers](https://github.com/electron/electron/blob/f403950503eb82bcfa230b13a909572beff75fc0/docs/tutorial/using-native-node-modules.md#using-native-node-modules). On windows this can easily be done via:
```
.\node_modules\.bin\electron-rebuild.cmd
```

The application can now be started using ```npm run dev```
