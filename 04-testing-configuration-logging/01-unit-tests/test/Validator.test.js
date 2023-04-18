const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('Проверка конструктора', () => {
      it('все правила должны содержать поля type', () => {
        const test = () => {
          const validator = new Validator({
            name: {
              min: 10,
              max: 20,
            },
          });
          return validator;
        };

        expect(test).to.throw();
      });
      it('все правила должны содержать поля min', () => {
        const test = () => {
          const validator = new Validator({
            name: {
              type: 'string',
              max: 20,
            },
          });
          return validator;
        };

        expect(test).to.throw();
      });
      it('все правила должны содержать поля max', () => {
        const test = () => {
          const validator = new Validator({
            name: {
              type: 'string',
              min: 10,
            },
          });
          return validator;
        };

        expect(test).to.throw();
      });
      it('поле max должно быть больше или равно поля min, иначе ошибка', () => {
        const test = () => {
          const validator = new Validator({
            name: {
              type: 'string',
              min: 10,
              max: 5,
            },
          });
          return validator;
        };

        expect(test).to.throw();
      });
      it('поле type должно быть string или number', () => {
        const test = () => {
          const validator = new Validator({
            name: {
              type: 'boolean',
              min: 5,
              max: 10,
            },
          });
          return validator;
        };

        expect(test).to.throw();
      });
      it('поле max должно быть числовым', () => {
        const test = () => {
          const validator = new Validator({
            name: {
              type: 'string',
              min: 5,
              max: 'hoho',
            },
          });
          return validator;
        };

        expect(test).to.throw();
      });
      it('поле min должно быть числовым', () => {
        const test = () => {
          const validator = new Validator({
            name: {
              type: 'string',
              min: 'haha',
              max: 4,
            },
          });
          return validator;
        };

        expect(test).to.throw();
      });
    });
    describe('Проверка валидации', () => {
      it('должен проверяться тип на строковый или числовой', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
          age: {
            type: 'number',
            min: 1,
            max: 99,
          },
        });
        const errors = validator.validate({name: 100, age: 'old'});
        expect(errors).to.have.length(2);
      });
      it('должны проверяться границы числовых полей', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 18,
            max: 70,
          },
          experience: {
            type: 'number',
            min: 3,
            max: 10,
          },
        });
        const errors = validator.validate({age: 100, experience: 1});
        expect(errors).to.have.length(2);
      });
      it('должны проверяться границы строковых полей', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 4,
            max: 10,
          },
          surnamme: {
            type: 'string',
            min: 4,
            max: 10,
          },
        });
        const errors = validator.validate({name: 'lee', surnamme: 'huan-chohoho'});
        expect(errors).to.have.length(2);
      });
    });
  });
});
