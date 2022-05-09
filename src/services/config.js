const baseUrl = 'https://api.rebill.to/v2/';
const baseUrlDev = 'https://api.rebill.dev/v2/';

const environments = {Prod: baseUrl, Dev: baseUrlDev};

export default class Config {
  static get endpoint() {
    return environments.Dev;
  }
}
