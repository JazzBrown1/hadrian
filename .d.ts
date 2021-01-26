declare module 'hadrian'{
  export class Model {
    constructor(options: object);
    init(options: object): function;
    authenticate(options: object): function;
    checkAuthentication(options: object): function;
    checkAuthenticated(options: object): function;
    checkUnauthenticated(options: object): function;
    logout(options: object): function;
  }
  export class Fail {
    constructor(reason: string);
  }
}