export default (string) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(string.data.contents, 'text/xml');

  const title = parsedData.querySelector('title').textContent;
  const description = parsedData.querySelector('description').textContent;

  const parsedItems = parsedData.querySelectorAll('item');

  const items = Array.from(parsedItems)
    .map((parsedItem) => ({
      link: parsedItem.querySelector('link').textContent,
      title: parsedItem.querySelector('title').textContent,
      description: parsedItem.querySelector('description').textContent,
    }));

  return { title, description, items };
};
