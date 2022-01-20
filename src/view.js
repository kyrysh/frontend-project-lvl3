import i18n from 'i18next';

export const renderErrors = (elements, error) => {
  elements.feedbackEl.classList.replace('text-success', 'text-danger');
  elements.feedbackEl.textContent = i18n.t(error);
  elements.RSSinput.classList.add('is-invalid');
};

export const showRSSfeed = (elements, URL) => {
  elements.form.reset();
  elements.RSSinput.focus;
  elements.feedbackEl.classList.replace('text-danger', 'text-success');
  elements.RSSinput.classList.remove('is-invalid');
  elements.feedbackEl.textContent = 'RSS was successfuly loaded';
  elements.RSSfeedEl.textContent =  'I will show you posts here!!!';
}