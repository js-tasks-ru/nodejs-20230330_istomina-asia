module.exports = class Validator {
  constructor(rules) {
    this.rules = rules;
    if (
      Object.values(rules).some((rule) => !Object.keys(rule).includes('type'))
    ) {
      throw new Error('All rules must include type');
    }
    if (
      Object.values(rules).some((rule) => !Object.keys(rule).includes('min'))
    ) {
      throw new Error('All rules must include min');
    }
    if (
      Object.values(rules).some((rule) => !Object.keys(rule).includes('max'))
    ) {
      throw new Error('All rules must include max');
    }
    if (Object.values(rules).some((rule) => rule.max < rule.min)) {
      throw new Error('Max must not be lower than min');
    }
    if (
      Object.values(rules).some(
          (rule) =>
            !['number', 'string'].includes(rule.type.trim().toLowerCase()),
      )
    ) {
      throw new Error('Type must be string or number');
    }

    if (Object.values(rules).some((rule) => typeof rule.max != 'number')) {
      throw new Error('Max must be number');
    }
    if (Object.values(rules).some((rule) => typeof rule.min != 'number')) {
      throw new Error('Min must be number');
    }
  }

  validate(obj) {
    const errors = [];

    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];

      const value = obj[field];
      const type = typeof value;


      const wrongType = type !== rules.type;

      if (wrongType) {
        errors.push({field, error: `expect ${rules.type}, got ${type}`});
        continue;
      }

      switch (type) {
        case 'string':
          if (value.length < rules.min) {
            errors.push({
              field,
              error: `too short, expect ${rules.min}, got ${value.length}`,
            });
          }
          if (value.length > rules.max) {
            errors.push({
              field,
              error: `too long, expect ${rules.max}, got ${value.length}`,
            });
          }
          break;
        case 'number':
          if (value < rules.min) {
            errors.push({
              field,
              error: `too little, expect ${rules.min}, got ${value}`,
            });
          }
          if (value > rules.max) {
            errors.push({
              field,
              error: `too big, expect ${rules.min}, got ${value}`,
            });
          }
          break;
      }
    }

    return errors;
  }
};
