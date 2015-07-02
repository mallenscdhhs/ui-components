/**
 * Creates a response for jasmine.Ajax.requests.
 * @class Response
 */
class Response {
  constructor(data, status = 200){
    this.status = status;
    this.contentType = 'application/json; charset=UTF-8';
    this.responseData = data;
    this.responseText = JSON.stringify(data);
  }
}

export default Response;
