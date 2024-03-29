/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable no-return-assign */
import { LitElement, html } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from './store.js';

store.dispatch({
  type: 'ADD_TODO',
  text: 'Read the docs',
});
store.dispatch({
  type: 'ADD_TODO',
  text: 'Read the docs2',
});
store.dispatch(dispatch =>
  setTimeout(() => dispatch({ type: 'ADD_TODO', text: 'This is async' }), 4000)
);
console.log(store.getState());

store.dispatch({
  type: 'INCREMENT',
});

function recounter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT2':
      return state + 1;
    case 'DECREMENT2':
      return state - 1;
    default:
      return state;
  }
}

store.addReducers({ lazyreducer: recounter });

function storeData(state = {}, action) {
  switch (action.type) {
    case 'FETCH_DATA':
      return { apiData: action.data };
    default:
      return state;
  }
}
store.addReducers({ dataStorage: storeData });
store.dispatch({ type: 'FETCH_DATA', data: { this: 'try' } });

store.dispatch(dispatch => {
  const fetchURL = `https://azaryah.sdyalor.me/api/graphql`;

  return fetch(fetchURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      query: `query { neumaticos { codNeumatico codMarca codModelo codMedida codDiseno estado codProveedor} }`,
    }),
  })
    .then(r => r.json())
    .then(data => dispatch({ type: 'FETCH_DATA', data }));
});

class MyApp extends connect(store)(LitElement) {
  constructor() {
    super();
    this.data = store.getState().dataStorage;
    store.subscribe(() => (this.data = store.getState().dataStorage));
  }

  static get Properties() {
    return {
      data: { type: Object },
    };
  }

  render() {
    return html`
      <h1>hello its me</h1>
      <button @click=${() => console.log(this.data)}>log data</button>
    `;
  }
}
customElements.define('my-app', MyApp);
