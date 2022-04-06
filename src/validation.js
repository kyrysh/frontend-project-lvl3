import * as yup from 'yup';

export default (field, urls) => {
  yup.setLocale({
    mixed: {
      required: () => 'feedbackMsg.validation.empty',
      notOneOf: () => 'feedbackMsg.validation.duplication',
    },
    string: {
      url: () => 'feedbackMsg.validation.notValid',
    },
  });

  const schema = yup.string().required().url().notOneOf(urls);

  const errors = schema
    .validate(field)
    .then(function() {
      return [];
    })
    .catch(function(err) {
      return err.errors;
    });
  return errors;
};
