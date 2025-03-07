// declare module 'passport-google-oauth20' {
//   // Default export as Strategy class
//   class Strategy {
//     constructor(
//       options: StrategyOptions,
//       verify: (accessToken: string, refreshToken: string | undefined, profile: any, done: (err: any, user?: any) => void) => void
//     );
//   }
//   export = Strategy; // Define as default export

//   interface StrategyOptions {
//     clientID: string;
//     clientSecret: string;
//     callbackURL: string;
//     accessType?: 'online' | 'offline';
//     prompt?: string;
//     scope?: string[];
//   }
// }