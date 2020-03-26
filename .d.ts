declare module 'hadrian'{
  export function init(options: object): string;
  export function authenticate(options: object): function;
  export function checkAuthenticated(options: object): function;
  export function checkUnauthenticated(options: object): function;
  export function logout(options: object): function;
  export function deserializeUser(options: object): function;
  export function defineModel(name?: string, options: object, isDefault?: boolean = false): function;
  export function modifyModel(name: string, options: object): function;
}