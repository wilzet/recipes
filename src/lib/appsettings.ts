export default class AppSettings {
    public static get USERNAME_MAX_LENGTH(): number { return 10; }
    public static get POSTTITLE_MAX_LENGTH(): number { return 40; }
    public static get SPECIAL_DATES(): string[] { return process.env.NEXT_PUBLIC_SPECIAL_DATES?.split(" ") ?? [] }
}