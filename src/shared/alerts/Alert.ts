export interface Alert<AlertType> {
    name: AlertType;
    triggered: boolean;
}