// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCYEpEct9aCCP3OEooDWmQK26MWEXkN7Qc',
    authDomain: 'simple-chat-84e0a.firebaseapp.com',
    databaseURL: 'https://simple-chat-84e0a.firebaseio.com',
    projectId: 'simple-chat-84e0a',
    storageBucket: 'simple-chat-84e0a.appspot.com',
    messagingSenderId: '931042437946'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
