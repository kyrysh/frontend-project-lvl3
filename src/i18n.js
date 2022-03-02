import i18n from 'i18next';
import ru from './locales/ru.js';
import app from './app.js';

export default () => {
  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    }
  }).then (app());
};


