declare module 'passport-google-oauth20' {
    interface StrategyOptions {
      accessType?: 'online' | 'offline';
      prompt?: string;
    }
  }