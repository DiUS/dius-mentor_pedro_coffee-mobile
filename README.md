# Coffee Shop Ordering API

React-Native App to work with this particular [API](https://github.com/DiUS/dius-mentor_boris_coffee-api/)

## Getting Started 
If you don't have `react-native-cli` installed, please get it installed by following the [Getting Started in React-Native](https://facebook.github.io/react-native/docs/getting-started.html)

**Run API**

Follow the [instructions](https://github.com/DiUS/dius-mentor_boris_coffee-api/) to run API

**Modify Endpoint**

Edit ENDPOINT in [Api.js](https://github.com/DiUS/dius-mentor_pedro_coffee-mobile/blob/master/Api.js) to point to your API endpoint in order to make the correct calls

**Install dependencies & run**

```
> npm install
> react-native start

> react-native run-android
	--or--
> react-native run-ios
```

**JEST Testing**
Tests are located on *__tests__* folder.

To run tests:
```
> npm test
```

**Cross-platform development**
There is no specific code for Android or iOS devices, 100% of the code is shared for both platfoms. 

* Api Calls (Model): Api.js using ApiUtil is in charge of all the communication between the app and API.
* Controller: CoffeeTodo.js works as controller between the 3 different views in the app.
* Views & Components: under views/ and components/ folders are located all the React-Native specific classes. 

