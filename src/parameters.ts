import "reflect-metadata";

{
  // Декоратор параметра
  function paramDecorator(target, key, parameterIndex) {
    console.log({ target, key, parameterIndex });
  }

  // Объявляем уникальный идентифактор для декоратора
  const requiredSymbol = Symbol("required");

  // Объявляем сам декоратор, который повесим на параметр
  function required(target, propertyName, parameterIndex) {
    let requiredParameters: number[] =
      Reflect.getOwnMetadata(requiredSymbol, target, propertyName) || [];

    requiredParameters.push(parameterIndex);

    Reflect.defineMetadata(
      requiredSymbol,
      requiredParameters,
      target,
      propertyName
    );
  }

  // Декоратор метода в котором есть обязательные аргументы
  function requireParams(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    // Сохраняем исходный метод
    const method = descriptor.value;
    // Переопределяем метод через дескриптор свойства
    descriptor.value = function () {
      let requiredParameters: number[] = Reflect.getOwnMetadata(
        requiredSymbol,
        target,
        propertyName
      );
      if (requiredParameters) {
        for (const parameterIndex of requiredParameters) {
          if (
            parameterIndex >= arguments.length ||
            arguments[parameterIndex] === undefined
          ) {
            throw new Error(
              `Missing required argument [${parameterIndex}] in ${propertyName}!`
            );
          }
        }
      }
      return method.apply(this, arguments);
    };
  }

  // Декоратор валидации типа аргумента
  const validate = (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    // Сохраняем ссылку на метод из дескриптора
    const method = descriptor.value;
    // Переопределяем метод в дескрипторе
    descriptor.value = function (value) {
      // Достаём тип переданного аргумента,
      // используя идентификатор "design:paramtypes"
      const [valueType] = Reflect.getOwnMetadata(
        "design:paramtypes",
        target,
        propertyName
      );

      if (!(value instanceof valueType)) {
        throw new TypeError(
          `Invalid type, got ${typeof value} not ${valueType.name}.`
        );
      }

      // Если всё ok, вызываем оригинальный метод с текущим контекстом
      return method.call(this, value);
    };
  };

  // Объявляем DTO для заполнения данных пользователя
  class UserDto {
    firstname: string;
    lastname: string;
    age: number;
  }

  class User {
    public role = "USER";
    public firstname;
    public secondname;

    // Вешаем декоратор валидации аргумента метода
    @validate
    public static fromDto(dto: UserDto): User {
      return new User(dto.firstname, dto.lastname);
    }

    constructor(firstname, secondname) {
      this.firstname = firstname;
      this.secondname = secondname;
    }

    someMethod(@paramDecorator param: any) {
      console.log(param);
    }

    // Применяем декоратор валидации для метода
    // и указываем обязательность передаваемых аргументов
    @requireParams
    setFullName(@required firstname: string, @required lastname: string) {
      this.firstname = firstname;
      this.secondname = lastname;
    }
  }

  const user = new User("John", "Doue");

  // @ts-ignore
  user.setFullName("Chuck");

  // Вместо DTO используем литерал объекта
  // const dto = {};

  // @ts-ignore
  // const user = User.fromDto(dto);
  // В рантайме получаем ошибку: Invalid type, got object not UserDto.
}
