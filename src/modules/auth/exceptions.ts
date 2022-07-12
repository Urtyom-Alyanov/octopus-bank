// TOKEN
export const TOKEN_EXPIRED_NO_REFRESH = {
  errorCode: 101,
  errorText: 'Токен просрочен без возможности перезапустить сессию',
};

export const TOKEN_EXPIRED = {
  errorCode: 102,
  errorText: 'Токен просрочен, перезапустите сессию',
};

export const TOKEN_NOT_FOUND = {
  errorCode: 103,
  errorText: 'Токена не существует',
};

// AUTH CODE
export const AUTH_CODE_EXPIRED = {
  errorCode: 104,
  errorText: 'Код авторизации просрочен',
};

export const AUTH_CODE_NOT_FOUND = {
  errorCode: 105,
  errorText: 'Код авторизации не найден',
};

// CLIENT
export const CLIENT_NOT_FOUND = {
  errorCode: 106,
  errorText: 'Клиент не найден',
};

// PASSWORD
export const PASSWORDS_NOT_MATCH = {
  errorCode: 107,
  errorText: 'Пароли не совпадают',
};

// REFRESH TOKEN
export const INVALID_REFRESH_TOKEN = {
  errorCode: 108,
  errorText: 'Токен перезапуска не соответствует токену доступа',
};

// LOGIN AND PASSWORD
export const INVALID_PASSWORD_OR_LOGIN = {
  errorCode: 109,
  errorText: 'Логин или пароль неверный',
};

// TOKEN GET
export const INVALID_GRANT_TYPE = {
  errorCode: 110,
  errorText: 'Неверный grant_type',
};

// FORBIDDEN
export const FORBIDDEN = {
  errorCode: 111,
  errorText: 'Нет доступа',
};
