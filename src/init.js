import i18n from 'i18next';
import resources from './locales/index.js';
import app from './app.js';

export default () => {
  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'en',
    debug: true,
    resources,
  }).then(app(i18nInstance));
};
