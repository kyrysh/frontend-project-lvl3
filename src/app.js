import validate from './validator.js';
import createWatchedState from './render.js';
import { loadInitial, loadTimer } from './loader.js';

export default (i18n) => {
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
        state: 'initial',
        error: '',
      },
    },
    loadedRSSfeeds: {
      feeds: [], // { id: uniqueId(), URL: '', title: '', description: '' }
      posts: [], // { feedId: '', URL: '', title: '', description: '' }
    },
    UIstate: {
      readedPostsURLs: [],
    },
  };

  const watchedState = createWatchedState(state, elements, i18n);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const enteredURL = data.get('url');

    const loadedFeedsUrls = watchedState.loadedRSSfeeds.feeds.map((feed) => feed.URL);

    const errors = validate(enteredURL, loadedFeedsUrls);
    errors
      .then((errs) => {
        watchedState.form.validation.error = errs.join(', ');
      })

      .then(() => {
        if (watchedState.form.validation.error.length === 0) {
          watchedState.form.process.state = 'initial';
          loadInitial(enteredURL, watchedState);
          loadTimer(watchedState, elements, i18n);
        }
      })

      .catch((error) => {
        if (error.response || error.request) {
          watchedState.form.process.error = 'feedbackMsg.processState.networkError';
        } else {
          watchedState.form.process.error = 'feedbackMsg.processState.notValid';
        }
        watchedState.form.process.state = 'failed';
      });
  });
};
