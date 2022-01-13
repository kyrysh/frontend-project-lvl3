import * as yup from 'yup';
import onChange from 'on-change';
import { renderErrors, showRSSfeed } from './view.js';

const schema = yup.string().required('Please, write RSS link').url('The entered URL is not valid');
const validate = (field) => {
  const errors = schema
    .validate(field)
    .then(function() {
      return [];
    })
    .catch(function(err) {
      return err.errors;
    });
  return errors;
}


const render = (elements) => (path, value, prevValue) => {
  switch(path) {
    case 'form.validation.errors':
      renderErrors(elements, value);
      break;
    case 'form.RSSurl.processed':
      showRSSfeed(elements, value);
  }
};

export default () => {

  const elements = {
    form: document.querySelector('form'),
    RSSinput: document.getElementById('url-input'),
    submitBtn: document.querySelector('button[type = "submit"]'),
    feedbackEl: document.querySelector('p.feedback'),
    RSSfeedEl: document.querySelector('div.posts'),
  };

  const state = onChange({
    form: {
      validation: {
        errors: [],
      },
      RSSurl: {
        entered: '',
        processed: '',
      }
    }
  }, render(elements));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data  = new FormData(e.target);
    state.form.RSSurl.entered = data.get('url');

    const errors = validate(state.form.RSSurl.entered);
    errors
      .then(function(errors) {
        state.form.validation.errors = errors;
      })
      .then(function() {
        if(state.form.RSSurl.entered === state.form.RSSurl.processed) {
          state.form.validation.errors = ['Such RSS already exists'];
        }
      })
      .then(function() {
        if(state.form.validation.errors.length === 0) {
          state.form.RSSurl.processed = state.form.RSSurl.entered;
        }
    })
    console.log(state);
  });
  
};

