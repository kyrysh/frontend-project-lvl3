import validate from './validator.js';
import createWatchedState from './render.js';
import { loadInitial, loadTimer } from './loader.js';

export default (i18n) => {
  const elements = {
    form: document.querySelector('form'),
    RSSinput: document.getElementById('url-input'),
    submitBtn: document.querySelector('button[type = "submit"]'),
    feedbackEl: document.querySelector('p.feedback'),
    RSSfeedsEl: document.querySelector('.feeds'),
    RSSpostsEl: document.querySelector('.posts'),
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
      posts: [], // { feedId: '', id: '', URL: '', title: '', description: '' }
    },
    UIstate: {
      readedPost: '',
      readedPostsIDs: [],
    },
  };

  const watchedState = createWatchedState(state, elements, i18n);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const enteredURL = data.get('url');

    const loadedFeedsUrls = watchedState.loadedRSSfeeds.feeds.map((feed) => feed.URL);

    validate(enteredURL, loadedFeedsUrls)
      .then((validURL) => {
        loadInitial(validURL, watchedState);
      })
      .catch((err) => {
        watchedState.form.validation.error = err.message;
      });
  });

  elements.RSSpostsEl.addEventListener('click', (e) => {
    const clickedEl = e.target;
    const id = clickedEl.dataset.postId;

    if (id && !watchedState.UIstate.readedPostsIDs.includes(id)) {
      watchedState.UIstate.readedPost = id;
      watchedState.UIstate.readedPostsIDs.push(id);
    }
  });

  loadTimer(watchedState);
};
