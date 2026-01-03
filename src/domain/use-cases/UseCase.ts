export interface UseCase<Subject, Output> {
    execute(input: Subject): Output;
}