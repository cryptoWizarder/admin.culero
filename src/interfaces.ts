export type OrNull<T> = T | null;
export type OrUndefined<T> = T | undefined;
export interface GoogleTokenInterface {
    email: string;
    email_verified: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
}
