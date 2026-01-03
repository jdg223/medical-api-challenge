export interface Validator<Subject> {
    isValid(data: Subject): boolean | Promise<boolean>;
}