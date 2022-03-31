import i18n from 'i18next';

export const renderErrors = (elements, error) => {
  elements.feedbackEl.classList.replace('text-success', 'text-danger');
  elements.feedbackEl.textContent = i18n.t(`${error}`);
  elements.RSSinput.classList.add('is-invalid');
};

export const handleProcessState = (elements, watchedState, processState) => {
  switch(processState) {
    case 'loaded':
      elements.form.reset();
      elements.RSSinput.focus;

      elements.submitBtn.disabled = false;
      elements.feedbackEl.classList.replace('text-info', 'text-success');
      elements.feedbackEl.textContent = i18n.t('feedbackMsg.processState.success');

      showFeedsAndPosts(elements.RSSfeedsEl, elements.RSSpostsEl, watchedState.loadedRSSfeeds.feeds, watchedState.loadedRSSfeeds.posts, watchedState.UIstate.readedPostsURLs);
      break;
     
    case 'loading':
      elements.submitBtn.disabled = true;
      elements.RSSinput.classList.remove('is-invalid');
      elements.feedbackEl.classList.remove('text-danger', 'text-success');
      elements.feedbackEl.classList.add('text-info');
      elements.feedbackEl.textContent = i18n.t('feedbackMsg.processState.loading');
      break;

    case 'failed':
      elements.submitBtn.disabled = false;
      elements.feedbackEl.classList.replace('text-info', 'text-danger');
      elements.feedbackEl.textContent = i18n.t(watchedState.form.process.error);
      elements.RSSinput.classList.add('is-invalid');
      break;

    default:
      throw new Error (`Unknown process state: ${processState}`)
  }
};

const createRSSelementsContainer = (RSSEl, header) => {

  const container = document.createElement('div');
  container.classList.add('card', 'border-0');
  const containerHeader = document.createElement('div');
  containerHeader.classList.add('card-body');
  const containerHeaderElement = document.createElement('h2');
  containerHeaderElement.classList.add('card-title', 'h4');
  containerHeaderElement.textContent = `${header}`;
  const ulElement = document.createElement('ul');
  ulElement.classList.add('list-group', 'border-0', 'rounded-0');

  containerHeader.appendChild(containerHeaderElement);
  container.appendChild(containerHeader);
  container.append(ulElement);
  RSSEl.appendChild(container);

  return ulElement;
}

const showFeedsAndPosts = (RSSfeedsEl, RSSpostsEl, loadedRSSfeeds, loadedRSSposts, readedRSSposts) => {
  RSSfeedsEl.innerHTML = '';
  RSSpostsEl.innerHTML = '';
  const ulFeedsContainer = createRSSelementsContainer(RSSfeedsEl, 'Фиды');
  const ulPostsContainer = createRSSelementsContainer(RSSpostsEl, 'Посты');

  loadedRSSfeeds.map(({ title, description }) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'border-0', 'border-end-0');

    const titleEl = document.createElement('h3');
    titleEl.classList.add('h6', 'm-0');
    titleEl.textContent = `${title}`;

    const descriptionEl = document.createElement('p');
    descriptionEl.classList.add('m-0', 'small', 'text-black-50');
    descriptionEl.textContent = `${description}`;
    
    liEl.append(titleEl);
    liEl.append(descriptionEl);

    //return liEl;

    ulFeedsContainer.prepend(liEl);
  });

  ///ulFeedsContainer.prepend(...feeds);

  const posts = loadedRSSposts.map(({ URL, title, description }) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    
    const aEl = document.createElement('a');
    aEl.classList.add('fw-bold');
    aEl.href = `${URL}`;
    aEl.setAttribute('target', '_blank');
    aEl.setAttribute('rel', 'noopener noreferrer');
    aEl.textContent = `${title}`;
    aEl.addEventListener('click', () => {
      if (!readedRSSposts.includes(aEl.href)) {
        readedRSSposts.push(aEl.href);
      }
      aEl.classList.remove('fw-bold');
      aEl.classList.add('fw-normal', 'link-secondary');
    });

    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.setAttribute('data-id', '2');
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', '#modal');
    btn.textContent = 'Просмотр';
    btn.addEventListener('click', () => {
      if (!readedRSSposts.includes(URL)) {
        readedRSSposts.push(URL);
      }
      aEl.classList.remove('fw-bold');
      aEl.classList.add('fw-normal', 'link-secondary');
    
      const modalTitle = document.querySelector('h5.modal-title');
      const modalBody = document.querySelector('div.modal-body');
      const fullAtricleBtn = document.querySelector('a.full-article');
    
      modalTitle.textContent = `${title}`;
      modalBody.textContent = `${description}`;
      fullAtricleBtn.href = `${URL}`;
    });

    liEl.append(aEl);
    liEl.append(btn);

    return liEl;
    //ulPostsContainer.append(liEl);
  });
  //console.log(posts);

  ulPostsContainer.prepend(...posts);
};