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
          id: item.id,
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
  const interval = 5000;
  const feedsURLs = _.map(watchedState.loadedRSSfeeds.feeds, 'URL');

  const promises = feedsURLs.map((feedURL) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feedURL)}`));

  Promise.all(promises)
    .then((responses) => {
      responses.forEach((response) => {
        // console.log(response.status);
        const posts = parseURL(response).items;
        posts.forEach((post) => {
          const postURL = post.link;

          if (_.find(watchedState.loadedRSSfeeds.posts, ['URL', postURL])) {
            return;
          }

          const newPost = {
            feedId: watchedState.loadedRSSfeeds.feeds.id,
            id: post.id,
            URL: postURL,
            title: post.title,
            description: post.description,
          };
          watchedState.loadedRSSfeeds.posts.push(newPost);
        });
      });
    })

    .finally(() => {
      setTimeout(() => loadTimer(watchedState), interval);
    });
};

export { loadInitial, loadTimer };
