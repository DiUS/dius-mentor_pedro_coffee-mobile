import 'react-native';
import React from 'react';
import Orders from '../views/Orders.js';
import renderer from 'react-test-renderer';
import 'isomorphic-fetch';

it('renders correctly', () => {
  const instance = renderer.create(
    <Orders />
  );
  expect(instance.toJSON()).toMatchSnapshot();
});
