import type { Alert } from "./Alert";

export interface AlertStrategy<Subject, AlertType> {
    alert(subject: Subject): Alert<AlertType>;
}
