import React from 'react';
import ReactDOM from 'react-dom';
import AppBarContainer from './AppBarContainer';

it('AppBarContainer renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppBarContainer />, div);
  ReactDOM.unmountComponentAtNode(div);
});
