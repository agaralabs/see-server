# sieve-js

Client side npm module for Sieve A/B Testing framework

This module meant to be compiled with the client-side js. It offers two simple functions:

`allocate()`: fetch experiments and buckets for current user from see-server
`track(event_name)`: track a user event

The module takes care of generating unique user ids and persisting state of allocated experiments across pages implicitly.


## Set up and integration

Install module using npm:

```sh
npm install sieve-js
```

Sample integration:

**NOTE**: Use webpack or browserify to compile for client side

```js
var Sieve = require('sieve-js');

var client = new Sieve({
    base_url: 'https://sieve-server-url'
});

client.allocate()
    .then(function (experiments) {
        console.log('allocated:', experiments);
    
        // experiment-specific business logic goes here
    
        return client.track('pay_btn_click', { pay_mode: 'credit card' });
    })
    .then(function () {
        console.log('done');
    })
    .catch(function (err) {
        console.log('oops', err.stack);
    });
```
