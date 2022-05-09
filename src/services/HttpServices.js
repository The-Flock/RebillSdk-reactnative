import Config from './config';
const JSON_MIME_TYPE = 'application/json';
const TYPE_DEFAULT_RESPONSE = 'json';

const HttpServices = (organizationId, baseUrl = Config.endpoint) => {
  const headers = {accept: JSON_MIME_TYPE};
  const getUrl = (url = '') => `${baseUrl}${url}`;
  const getSearchParams = params => {
    if (!params) {
      return '';
    }
    const searchParams = new URLSearchParams();
    Object.entries(params)
      .filter(([key, value]) => value !== undefined && value !== null)
      .forEach(([key, value]) => searchParams.append(key, value));
    return `?${searchParams.toString()}`;
  };

  const processResponse = async (response, type = 'json') => {
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

  const getJsonPatch = data =>
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
  const get = async (url, params, typeResponse = TYPE_DEFAULT_RESPONSE) => {
    const response = await fetch(`${getUrl(url)}${getSearchParams(params)}`, {
      headers: {
        organization_id: organizationId,
        ...headers,
      },
    });
    return processResponse(response, typeResponse);
  };

  /**
   * Send a POST request to the given URL.
   * @param {string} url a URL where the request is send.
   * @param {any} body data to be included in the request body.
   * @returns {Promise<any>} A promise with the response body when the request is completed.
   */
  const post = async (url, body, typeResponse = TYPE_DEFAULT_RESPONSE) => {
    const response = await fetch(getUrl(url), {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        organization_id: organizationId,
        'content-type': JSON_MIME_TYPE,
        ...headers,
      },
    });
    return processResponse(response, typeResponse);
  };

  /**
   * Send a PUT request to the given URL.
   * @param {string} url a URL where the request is send.
   * @param {any} body data to be included in the request body.
   * @returns {Promise<any>} A promise with the response body when the request is completed.
   */
  const put = async (url, body, typeResponse = TYPE_DEFAULT_RESPONSE) => {
    const response = await fetch(getUrl(url), {
      method: 'put',
      body: JSON.stringify(body),
      headers: {
        'content-type': JSON_MIME_TYPE,
        organization_id: organizationId,
        ...headers,
      },
    });
    return processResponse(response, typeResponse);
  };

  /**
   * Send a PATCH request to the given URL.
   * @param {string} url a URL where the request is send.
   * @param {any} data data to be included in the JSON Patch.
   * @return {Promise<*>} A promise with the response body when the request is completed.
   */
  const patch = async (url, data, typeResponse = TYPE_DEFAULT_RESPONSE) => {
    const response = await fetch(getUrl(url), {
      method: 'patch',
      body: JSON.stringify(getJsonPatch(data)),
      headers: {
        'content-type': JSON_MIME_TYPE,
        organization_id: organizationId,
        ...headers,
      },
    });
    return processResponse(response, typeResponse);
  };

  /**
   * Send a DELETE request to the given URL.
   * @param {string} url a URL where the request is send.
   * @param {any} body data to be included in the request body.
   * @returns {Promise<any>} A promise with the response body when the request is completed.
   */
  const del = async (url, body, typeResponse = TYPE_DEFAULT_RESPONSE) => {
    const response = await fetch(getUrl(url), {
      method: 'delete',
      body: JSON.stringify(body),
      headers: {
        'content-type': JSON_MIME_TYPE,
        organization_id: organizationId,
        ...headers,
      },
    });
    return processResponse(response, typeResponse);
  };

  /**
   * Send a POST file request to the given URL.
   * @param {string} url a URL where the request is send.
   * @param {string} uri a URI to the file to be send in the request body.
   * @returns {Promise<any>} A promise with the response body when the request is completed.
   */
  const postFile = async (url, uri) => {
    const body = new FormData();
    body.append('file', {uri, type: 'application/octet-stream', name: 'file'});
    const response = await fetch(getUrl(url), {
      body,
      method: 'POST',
      headers: {
        ...headers,
        organization_id: organizationId,
        'Content-Type': 'multipart/form-data',
      },
    });
    return processResponse(response);
  };

  return {get, post, put, patch, del, postFile};
};

export default HttpServices;
