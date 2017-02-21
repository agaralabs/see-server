# see-js

Client side npm module for Stayzilla Experimentation Engine

## Set up and integration

Install module using npm:

```sh
npm install see-js
```

Sample integration:

**NOTE**: Use webpack or browserify to compile for client side

```js
var See = require('see-js');

var client = new See({
    base_url: 'https://see-server-url'
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
