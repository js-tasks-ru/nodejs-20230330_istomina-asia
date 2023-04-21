function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Оба параметра должны быть числовыми!');
  }
  return a + b;
}

module.exports = sum;
