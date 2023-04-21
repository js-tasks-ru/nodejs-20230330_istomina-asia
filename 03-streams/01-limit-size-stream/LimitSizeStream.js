const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.maxSize = options.limit;
    this.currentSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.currentSize += chunk.byteLength;
    let err = null;
    if (this.currentSize > this.maxSize) {
      err = new LimitExceededError('Max size exceeded');
    }
    callback(err, chunk);
  }
}

module.exports = LimitSizeStream;
