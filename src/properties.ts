{
  // Декоратор проверки указания статического свойства
  function mustBeStatic(target, key) {
    if (typeof target !== "function" || !(key in target)) {
      throw new Error(`Property "${key}" must by a static`);
    }
  }

  class User {
    // Указываем, что поле должно быть статическим
    @mustBeStatic
    public static role = "USER";
  }

  const user = new User();
}
