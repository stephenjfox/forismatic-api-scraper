const fetch = require('node-fetch');
const fs = require('fs-promise');
const api = Object.freeze({
  endpoint: 'http://api.forismatic.com/api/1.0/',
  format: 'json',
  method: 'getQuote',
  language: 'en'
});

const requestUrl =
`${api.endpoint}?format=${api.format}&lang=${api.language}&method=${api.method}`;

const randomKey = () => (+((Math.random() * 10000).toString().split('.')[0]));

/*
You should be warned that there is a limit (I haven't got it exact) to the number
of requests allowed before things start to behave strangely. Namely:
  - The internal parsing in node-fetch (JSON.parse) can't read the result of the
    node-fetch call. You have to wait something like 5 minutes
  - It may also have to do with the number of requests being processed at once.
    I start to get hiccuppy results around 15 Promises
*/
const requestCount = 15;

const requests = [];
for (var i = 0; i < requestCount; i++) {
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
.then(props =>
  fs.writeFile('output.json', JSON.stringify(props), 'utf8')
    .catch(err => console.error("Failed to write:", err))
)
.catch(console.error);
