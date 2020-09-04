class Fail extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.reason = message;
    this.isFail = true;
  }
}

export default Fail;
