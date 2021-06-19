{
  // Декоратор метода
  function methodDecorator(target, key, descriptor) {
    console.log(`Target constructor: ${target.constructor.name}`);
    console.log({ target, key, descriptor });
  }

  // Декоратор форматирования результата вызова метода
  function upperCase(target, key, descriptor) {
    // Переопределяем дескриптор свойства
    Object.defineProperty(target, key, {
      ...descriptor,
      value: function () {
        return descriptor.value.call(this).toUpperCase();
      },
    });

    // target будет использован как дескриптор свойства
    return target;
  }

  class User {
    public firstname;
    public secondname;

    constructor(firstname, secondname) {
      this.firstname = firstname;
      this.secondname = secondname;
    }

    // Объявляем метод и применяем к нему декоратор
    @methodDecorator
    //   @upperCase
    getFullName(): string {
      return this.firstname + " " + this.secondname;
    }
  }

  const user = new User("John", "Doue");
  console.log(user.getFullName());
}
