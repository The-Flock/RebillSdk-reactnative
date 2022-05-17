// @flow
import Config from './config';
const JSON_MIME_TYPE = 'application/json';
const TYPE_DEFAULT_RESPONSE = 'json';

/**
 * A wrapper for the fetch API.
 */
class Http {
  constructor(organizationId, baseUrl = Config.endpoint) {
    this.organizationId = organizationId;
    this.baseUrl = baseUrl;
    this.headers = {accept: JSON_MIME_TYPE};
  }

  getUrl = (url = '') => `${this.baseUrl}${url}`;
  getSearchParams = params => {
    if (!params) {
      return '';
    }
    const searchParams = new URLSearchParams();
    Object.entries(params)
      .filter(([key, value]) => value !== undefined && value !== null)
      .forEach(([key, value]) => searchParams.append(key, value));
    return `?${searchParams.toString()}`;
  };

  processResponse = async (response, type = 'json') => {
    let result;
    switch (type) {
      case 'json':
        result = await response.json();
        break;
      case 'blob':
        result = await response.blob();
        break;
      default:
        result = true;
        break;
    }
    return {response, result};
  };

  getJsonPatch = data =>
    Object.entries(data).map(([key, value]) => ({
      value,
      op: 'add',
      path: `/${key}`,
    }));

  /**
   * Send a GET request to the given URL.
   * @param {String} url a URL where the request is send.
   * @param {Object} params The query params to be added to the request.
   * @returns {Promise<any>} A promise with the response body when the request is completed.
   */
  get = async (url, params, typeResponse = TYPE_DEFAULT_RESPONSE) => {
    const response = await fetch(
      `${this.getUrl(url)}${this.getSearchParams(params)}`,
      {
        headers: {
          organization_id: this.organizationId,
          ...this.headers,
        },
      },
    );
    return this.processResponse(response, typeResponse);
  };

  /**
   * Send a POST request to the given URL.
   * @param {string} url a URL where the request is send.
   * @param {any} body data to be included in the request body.
   * @returns {Promise<any>} A promise with the response body when the request is completed.
   */
  post = async (url, body, typeResponse = TYPE_DEFAULT_RESPONSE) => {
    const response = await fetch(this.getUrl(url), {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        organization_id: this.organizationId,
        'content-type': JSON_MIME_TYPE,
        ...this.headers,
      },
    });
    return this.processResponse(response, typeResponse);
  };

  /**
   * Send a PUT request to the given URL.
   * @param {string} url a URL where the request is send.
   * @param {any} body data to be included in the request body.
   * @returns {Promise<any>} A promise with the response body when the request is completed.
   */
  put = async (url, body, typeResponse = TYPE_DEFAULT_RESPONSE) => {
    const response = await fetch(this.getUrl(url), {
      method: 'put',
      body: JSON.stringify(body),
      headers: {
        'content-type': JSON_MIME_TYPE,
        organization_id: this.organizationId,
        ...this.headers,
      },
    });
    return this.processResponse(response, typeResponse);
  };

  /**
   * Send a PATCH request to the given URL.
   * @param {string} url a URL where the request is send.
   * @param {any} data data to be included in the JSON Patch.
   * @return {Promise<*>} A promise with the response body when the request is completed.
   */
  patch = async (url, data, typeResponse = TYPE_DEFAULT_RESPONSE) => {
    const response = await fetch(this.getUrl(url), {
      method: 'patch',
      body: JSON.stringify(this.getJsonPatch(data)),
      headers: {
        'content-type': JSON_MIME_TYPE,
        organization_id: this.organizationId,
        ...this.headers,
      },
    });
    return this.processResponse(response, typeResponse);
  };

  /**
   * Send a DELETE request to the given URL.
   * @param {string} url a URL where the request is send.
   * @param {any} body data to be included in the request body.
   * @returns {Promise<any>} A promise with the response body when the request is completed.
   */
  del = async (url, body, typeResponse = TYPE_DEFAULT_RESPONSE) => {
    const response = await fetch(this.getUrl(url), {
      method: 'delete',
      body: JSON.stringify(body),
      headers: {
        'content-type': JSON_MIME_TYPE,
        organization_id: this.organizationId,
        ...this.headers,
      },
    });
    return this.processResponse(response, typeResponse);
  };

  /**
   * Send a POST file request to the given URL.
   * @param {string} url a URL where the request is send.
   * @param {string} uri a URI to the file to be send in the request body.
   * @returns {Promise<any>} A promise with the response body when the request is completed.
   */
  postFile = async (url, uri) => {
    const body = new FormData();
    body.append('file', {uri, type: 'application/octet-stream', name: 'file'});
    const response = await fetch(this.getUrl(url), {
      body,
      method: 'POST',
      headers: {
        ...this.headers,
        organization_id: this.organizationId,
        'Content-Type': 'multipart/form-data',
      },
    });
    return this.processResponse(response);
  };
}

export default Http;
