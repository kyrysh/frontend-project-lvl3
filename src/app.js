import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
//import { uniqueId, map } from 'lodash';
//import find from 'lodash';
import validate from './validation.js';
import { handleProcessState, renderErrors } from './view.js';




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
        state: '',
        error: '',
      },
      enteredURL: '',
    },
    loadedRSSfeeds: {
      feeds: [], // { id: uniqueId(), URL: '', title: '', description: '' }
      posts: [], // { feedId: '', URL: '', title: '', description: '' }
    },
    UIstate: {
      readedPostsURLs: [],
    }
  };

  const watchedState = onChange(state, (path, value) => {
    switch(path) {
      case 'form.validation.error':
        renderErrors(elements, value, i18n);
        break;

      case 'form.process.state':
        handleProcessState(elements, state, value, i18n);
        break;
        
      default:
        break;
    }
  });
  

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data  = new FormData(e.target);
    watchedState.form.enteredURL = data.get('url');

    const loadedFeedsUrls = watchedState.loadedRSSfeeds.feeds.map((feed) => feed.URL);

    const errors = validate(watchedState.form.enteredURL, loadedFeedsUrls);
    errors
      .then(function (errors) {
        watchedState.form.validation.error = errors.join(', ');
        //console.log(watchedState.form.validation.error);
      })

      /*.then(function() {
        if(watchedState.loadedRSSfeeds.feeds.some((e) => e.URL === watchedState.form.enteredURL)) {
          watchedState.form.validation.error = 'feedbackMsg.validation.duplication';
        }
      })*/

      .then(function() {
        if(watchedState.form.validation.error.length === 0) {
          watchedState.form.process.state = 'loading';
          watchedState.form.process.error = '';

          axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(watchedState.form.enteredURL)}`)
          .then(function(response) {
            const parser = new DOMParser();
            const parsedResponse = parser.parseFromString(response.data.contents, 'text/xml');

            const feed = { 
              id: _.uniqueId(),
              URL: watchedState.form.enteredURL,
              title: parsedResponse.querySelector('title').textContent, 
              description: parsedResponse.querySelector('description').textContent,
            };
            watchedState.loadedRSSfeeds.feeds.push(feed);

            const parsedPosts = parsedResponse.querySelectorAll('item');
            parsedPosts.forEach((parsedPost) => {
              const post = {
                feedId: feed.id,
                URL: parsedPost.querySelector('link').textContent,
                title: parsedPost.querySelector('title').textContent,
                description: parsedPost.querySelector('description').textContent,
              };
              watchedState.loadedRSSfeeds.posts.push(post);
            })

            watchedState.form.process.state = 'loaded';

            setTimeout (function updatePosts() {
              const feedsURLs = _.map(watchedState.loadedRSSfeeds.feeds, 'URL');
              feedsURLs.forEach((feedURL) => {
                axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feedURL)}`)
  
                  .then(function(response) {
                  const parser = new DOMParser();
                  const parsedResponse = parser.parseFromString(response.data.contents, 'text/xml');

                  const newParsedPosts = parsedResponse.querySelectorAll('item');
                  newParsedPosts.forEach((parsedPost) => {
                    const newParsedPostLink = parsedPost.querySelector('link').textContent;

                    if (_.find(watchedState.loadedRSSfeeds.posts, ['URL', newParsedPostLink])) {
                      return;
                    }

                    const newPost = {
                      feedId: feed.id,
                      URL: newParsedPostLink,
                      title: parsedPost.querySelector('title').textContent,
                      description: parsedPost.querySelector('description').textContent,
                    };
                    
                    watchedState.loadedRSSfeeds.posts.push(newPost);
                    handleProcessState(elements, watchedState, 'loaded');
                  })
                })
              })
              
              setTimeout(updatePosts, 5000);
            }, 5000);

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