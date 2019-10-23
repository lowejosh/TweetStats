import React from 'react';
import ReactDOM from 'react-dom';
import StatContainer from './StatContainer';

it('StatContainer renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<StatContainer />, div);
  ReactDOM.unmountComponentAtNode(div);
});
