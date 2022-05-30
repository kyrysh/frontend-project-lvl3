import * as yup from 'yup';

export default (value, setOfValues) => {
  yup.setLocale({
    mixed: {
      required: () => 'feedbackMsg.validation.empty',
      notOneOf: () => 'feedbackMsg.validation.duplication',
    },
    string: {
      url: () => 'feedbackMsg.validation.notValid',
    },
  });

  const schema = yup.string().required().url().notOneOf(setOfValues);

  const errors = schema
    .validate(value)
    .then(() => [])
    .catch((err) => err.errors);
  return errors;
};
