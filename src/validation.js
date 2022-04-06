import * as yup from 'yup';

const schema = yup.string().required('feedbackMsg.validation.empty').url('feedbackMsg.validation.notValid');

export default (field) => {
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
