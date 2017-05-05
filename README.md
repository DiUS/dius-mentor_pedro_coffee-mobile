# Coffee Shop Ordering API
[![Build status](https://badge.buildkite.com/6484318ee252264a9060c4bd0b59d30c2dfd2fd1d55986ae3e.svg)](https://buildkite.com/dius-3/mentoring-coffee-shop-mobile)
[![Pact](https://img.shields.io/badge/Pact-up-brightgreen.svg)](https://coffee.pact.dius.com.au)

React-Native App to work with this particular [API](https://github.com/DiUS/dius-mentor_boris_coffee-api/)

## Getting Started 
If you don't have `react-native-cli` installed, please get it installed by following the [Getting Started in React-Native](https://facebook.github.io/react-native/docs/getting-started.html)

**Run API**

Follow the [instructions](https://github.com/DiUS/dius-mentor_boris_coffee-api/) to run API

**Modify Endpoint**

set your environment variable for `coffeeApiBaseUrl` that will be used in [config.js](https://github.com/DiUS/dius-mentor_pedro_coffee-mobile/blob/master/config.js) to point to your API endpoint

**Install dependencies & run**

```
> npm install
> react-native start

  --choose your platform--
Android > react-native run-android
iOS     > react-native run-ios
Web     > npm run-script web
```

**JEST Testing**

Tests are located on *__tests__* folder, including a [Pact](https://github.com/pact-foundation/pact-js) consumer.

To run tests:
```
> npm test -- --coverage
```

**Publishing your consumer**

[Publish](https://github.com/DiUS/dius-mentor_pedro_coffee-mobile/blob/master/publish/publish.js) was added in order to share your pact consumer (check [Pact Broker](https://docs.pact.io/documentation/sharings_pacts.html)). Before run *publish.js*, run tests and set your environment variables for `pactBroker`, `pactBrokerUsername`, `pactBrokerPassword`.
```
> npm run-script pactPublish
```


**Cross-platform development**

There is no specific code for Android or iOS devices, 100% of the code is shared for both platfoms. 

* **Api Requests**: Client.js using ApiUtil is in charge of all the communication between the app and API.
* **Controller**: CoffeeTodo.js works as controller between the 3 different views in the app.
* **Views & Components**: under views/ and components/ folders are located all the React-Native specific classes. 

