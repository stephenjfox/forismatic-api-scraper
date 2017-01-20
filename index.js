const fetch = require('node-fetch');
const api = Object.freeze({
  endpoint: 'http://api.forismatic.com/api/1.0/',
  format: 'json',
  method: 'getQuote',
  language: 'en'
});

const requestUrl =
`${api.endpoint}?format=${api.format}&lang=${api.language}&method=${api.method}`;

const randomKey = () => (+((Math.random() * 10000).toString().split('.')[0]));

const requests = [];
for (var i = 0; i < 2; i++) {
  requests.push(
    fetch(`${requestUrl}&key=${randomKey()}`).then(res => res.json())
  );
}

Promise.all(requests)
.then(jsons => jsons.map(({ quoteAuthor, quoteText }) => ({
    author: quoteAuthor,
    text: quoteText
  }))
)
.then(console.log)
.catch(console.error);
