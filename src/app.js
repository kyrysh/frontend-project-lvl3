import onChange from 'on-change';
import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import validate from './validation.js'
import { handleProcessState, renderErrors } from './view.js';


export default () => {

  const elements = {
    form: document.querySelector('form'),
    RSSinput: document.getElementById('url-input'),
    submitBtn: document.querySelector('button[type = "submit"]'),
    feedbackEl: document.querySelector('p.feedback'),
    RSSfeedsEl: document.querySelector('div.feeds'),
    RSSpostsEl: document.querySelector('div.posts'),
  };

  const state = {
    form: {
      validation: {
        error: '',
      },
      process: {
        state: '',
        error: '',
      },
      enteredURL: '',
    },
    loadedRSSfeeds: {
      feeds: [], // { id: uniqueId(), URL: '', title: '', description: '' }
      posts: [], // { feedId: '', title: '', URL: '' }
    },
  };

  const watchedState = onChange(state, (path, value) => {
    switch(path) {
      case 'form.validation.error':
        renderErrors(elements, value);
        break;

      case 'form.process.state':
        handleProcessState(elements, state, value);
        break;

      /*case 'form.process.error':
        handleProcessError(elements, value);
        break;*/

      default:
        break;
    }
  });
  

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data  = new FormData(e.target);
    watchedState.form.enteredURL = data.get('url');

    const errors = validate(watchedState.form.enteredURL);
    errors
      .then(function (errors) {
        watchedState.form.validation.error = errors.join(', ');
      })

      .then(function() {
        if(watchedState.loadedRSSfeeds.feeds.some((e) => e.URL === watchedState.form.enteredURL)) {
          watchedState.form.validation.error = 'feedbackMsg.validation.duplication';
        }
      })

      .then(function() {
        if(watchedState.form.validation.error.length === 0) {
          watchedState.form.process.state = 'loading';
          watchedState.form.process.error = '';

          axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(watchedState.form.enteredURL)}`)
          .then(function(response) {
            const parser = new DOMParser();
            const parsedResponse = parser.parseFromString(response.data.contents, 'text/xml');

            const feed = { 
              id: uniqueId(),
              URL: watchedState.form.enteredURL,
              title: parsedResponse.querySelector('title').textContent, 
              description: parsedResponse.querySelector('description').textContent,
            };
            watchedState.loadedRSSfeeds.feeds.push(feed);

            const parsedPosts = parsedResponse.querySelectorAll('item');
            parsedPosts.forEach((parsedPost) => {
              const post = {
                feedId: feed.id,
                title: parsedPost.querySelector('title').textContent,
                URL: parsedPost.querySelector('link').textContent,
              };
              watchedState.loadedRSSfeeds.posts.push(post);
            })

            watchedState.form.process.state = 'loaded';
          })
          
          .catch(function (error) {
            if (error.response || error.request) {
              console.log('CONNECTION error');
              watchedState.form.process.error = 'feedbackMsg.processState.networkError';
            } else {
              console.log('PARSING error');
              watchedState.form.process.error = 'feedbackMsg.processState.notValid';
            }
            
            watchedState.form.process.state = 'failed';
          })
        }
      })
  });
};