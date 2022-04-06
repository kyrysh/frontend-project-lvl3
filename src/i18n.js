import i18n from 'i18next';
import ru from './locales/ru.js';
import app from './app.js';

export default () => {
  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    }
  }).then (app(i18nInstance));
};


