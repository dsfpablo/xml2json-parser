export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      APP_PORT: number;
      MAKES_API_URL: string;
      MAKE_TYPES_API_URL: string;
    }
  }
}
