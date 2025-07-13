
export default class InvalidAccountIDException extends Error {

  constructor(message) {
    super(message);
    this.name = "InvalidAccountIDException";
  }
}
