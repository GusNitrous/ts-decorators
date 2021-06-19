{
  // Объявляем декоратор класса
  function classDecorator(target) {
    console.log(target, typeof target);
  }

  // Объявляем декоратор, который будет помечать класс как deprecated
  function deprecated<T extends { new (...args: any[]): {} }>(
    targetConstructor: T
  ) {
    return class extends targetConstructor {
      constructor(...args) {
        // Просто пишем в консоль, что инстанцируется deprecated класс
        console.warn(`Instantiate deprecated class: ${targetConstructor.name}`);
        super(...args);
      }
    };
  }

  function classDecoratorOne<T extends { new (...args: any[]): {} }>(
    target: T
  ) {
    console.log("Evaluated classDecoratorOne");

    return class extends target {
      constructor(...args) {
        console.log(`Instantiate class: ${target.name} in classDecoratorOne`);
        super(...args);
      }
    };
  }

  function classDecoratorTwo<T extends { new (...args: any[]): {} }>(
    target: T
  ) {
    console.log("Evaluated classDecoratorTwo");

    return class extends target {
      constructor(...args) {
        console.log(`Instantiate class: ${target.name} in classDecoratorTwo`);
        super(...args);
      }
    };
  }

  // Объявляем простой класс и применяем к нему декоратор
  @classDecorator
  // @deprecated
  // @classDecoratorOne
  // @classDecoratorTwo
  class User {
    public firstname;
    public secondname;

    constructor(firstname, secondname) {
      this.firstname = firstname;
      this.secondname = secondname;
    }
  }

  const user = new User("John", "Doue");
}
