import axios from 'axios';
import _ from 'lodash';
import parseURL from './parser.js';

const loadInitial = (enteredURL, watchedState) => {
  watchedState.form.process.state = 'loading';
  watchedState.form.process.error = '';

  axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(enteredURL)}`)

    .then((response) => {
      const { title, description, items } = parseURL(response);

      const feed = {
        id: _.uniqueId(),
        URL: enteredURL,
        title,
        description,
      };
      watchedState.loadedRSSfeeds.feeds.push(feed);

      items.forEach((item) => {
        const post = {
          feedId: feed.id,
          URL: item.link,
          title: item.title,
          description: item.description,
        };
        watchedState.loadedRSSfeeds.posts.push(post);
      });
      watchedState.form.process.state = 'loaded';
    })

    .catch((error) => {
      if (error.response || error.request) {
        watchedState.form.process.error = 'feedbackMsg.processState.networkError';
      } else {
        watchedState.form.process.error = 'feedbackMsg.processState.notValid';
      }
      watchedState.form.process.state = 'failed';
    });
};

const loadTimer = (watchedState) => {
  setTimeout(function updatePosts() {
    const feedsURLs = _.map(watchedState.loadedRSSfeeds.feeds, 'URL');

    feedsURLs.forEach((feedURL) => {
      axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feedURL)}`)

        .then((responseTimer) => {
          const itemsTimer = parseURL(responseTimer).items;

          itemsTimer.forEach((itemTimer) => {
            const newItemURL = itemTimer.link;

            if (_.find(watchedState.loadedRSSfeeds.posts, ['URL', newItemURL])) {
              return;
            }

            const newPost = {
              feedId: watchedState.loadedRSSfeeds.feeds.id,
              URL: newItemURL,
              title: itemTimer.title,
              description: itemTimer.description,
            };

            watchedState.loadedRSSfeeds.posts.push(newPost);
          });
        });
    });

    setTimeout(updatePosts, 5000);
  }, 5000);
};

export { loadInitial, loadTimer };
