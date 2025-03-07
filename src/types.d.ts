declare module "passport-google-oauth20" {
  import { Strategy as PassportStrategy } from "passport";
  interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    accessType?: "online" | "offline";
    prompt?: string;
    scope?: string[];
  }

  export class Strategy extends PassportStrategy {
    constructor(
      options: StrategyOptions,
      verify: (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (err: any, user?: any) => void
      ) => void
    );
  }


  declare module 'passport' {
    interface AuthenticateOptions {
      accessType?: 'online' | 'offline';
      prompt?: string;
      scope?: string[];
    }
  }

}


// Extend passport's AuthenticateOptions
