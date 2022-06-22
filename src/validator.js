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

  try {
    return schema.validate(value);
  } catch (err) {
    return err;
  }
};
