import 'react-native';
import React from 'react';
import Drink from '../views/Drink.js';
import renderer from 'react-test-renderer';
import 'isomorphic-fetch';

var order = {
  id:1,
  coffees:null,
  name:'test_order',
  path:'order/1'
}

var drink = {
  id:1,
  style:'Latte',
  size:'3/4',
  path:'/order/1/coffee/1'
}

it('renders correctly', () => {
  const instance = renderer.create(
    <Drink order={order} drink={drink}/>
  );
  expect(instance.toJSON()).toMatchSnapshot();
});
