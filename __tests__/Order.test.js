import 'react-native';
import React from 'react';
import Order from '../views/Order.js';
import renderer from 'react-test-renderer';
import 'isomorphic-fetch';

var order = {
  id:1,
  coffees:null,
  name:"test_order",
  path:"order/1"
}
it('renders correctly', () => {
  const instance = renderer.create(
    <Order order={order}/>
  );
  expect(instance.toJSON()).toMatchSnapshot();
});
