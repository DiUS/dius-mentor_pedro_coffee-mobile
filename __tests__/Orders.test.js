import 'react-native';
import React from 'react';
import Orders from '../views/Orders.js';
import renderer from 'react-test-renderer';
import 'isomorphic-fetch';

var orders = []
it('renders correctly', () => {
  const instance = renderer.create(
    <Orders orders={orders}/>
  );
  expect(instance.toJSON()).toMatchSnapshot();
});
