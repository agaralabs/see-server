var Sieve = require('sieve-js');

var client = new Sieve({
    base_url: process.env.API_URL || 'http://localhost:8090'
});

client.allocate()
    .then(function (experiments) {
        console.log('allocated:', experiments);

        // experiment-specific business logic goes here
        var button = document.getElementById('goal');

        experiments.forEach(function (e) {
            if (e.id === 1 && e.usr_variation) {
                switch (e.usr_variation.name) {
                    case 'bluebutton':
                        console.log('Allocated to the blue button variation!')
                        button.style.backgroundColor = "blue";
                        button.style.color = "white";
                        button.innerText = "Blue button!";
                        break;
                    case 'greenbutton':
                        console.log('Allocated to the green button variation!')
                        button.style.backgroundColor = "green";
                        button.style.color = "white";
                        button.innerText = "Green button!";
                        break;
                    default:
                        console.log('Allocated to the default variation!');
                }
            }
        });

        button.onclick = function () {
            client
                .track('button-click')
                .then(console.log('tracked button-click'))
                .catch(errorHandler)
        };

    })
    .catch(errorHandler);

function errorHandler(err) {
    console.log('oops', err.stack);
}