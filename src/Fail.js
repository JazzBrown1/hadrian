class Fail extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = 'ValidationError'; // (2)
    this.reason = message;
    this.isFail = true;
  }
}

export default Fail;
