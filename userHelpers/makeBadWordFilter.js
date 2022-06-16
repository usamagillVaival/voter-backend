const unirest = require('unirest');
const InvalidFormatException = require('../errors/InvalidFormatException');
const { key, mock } = require('../config').badWordsApi;

const mockWalletService = {
  checkUsername: () => true,
};
module.exports = () => {
  if (mock) {
    return mockWalletService;
  }
  const wordFilterService = {};

  const rapidApiUrl = 'https://neutrinoapi-bad-word-filter.p.rapidapi.com/bad-word-filter';
  const rapidApiHeaders = {
    'content-type': 'application/x-www-form-urlencoded',
    'x-rapidapi-key': key,
    'x-rapidapi-host': 'neutrinoapi-bad-word-filter.p.rapidapi.com',
    useQueryString: true,
  };

  const postRequest = (url) => unirest('POST', url);

  const postWithPromise = function (url, headers, content) {
    return new Promise((resolve, reject) => {
      const req = postRequest(url);
      req.headers(headers);
      req.form({
        content,
      });
      req.end((res) => {
        if (res.error) reject(res.error);
        resolve(res.body);
      });
    });
  };

  async function badWordsFilter(word) {
    return postWithPromise(rapidApiUrl, rapidApiHeaders, word);
  }

  wordFilterService.checkUsername = async (username) => {
    const response = await badWordsFilter(username);
    const badWords = response['bad-words-list'];
    if (badWords.length > 0) {
      throw new InvalidFormatException('The username contains bad words');
    }
  };

  return wordFilterService;
};
