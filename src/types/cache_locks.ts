export interface CacheLock {
  key: string;
  owner: string;
  expiration: number;
}
