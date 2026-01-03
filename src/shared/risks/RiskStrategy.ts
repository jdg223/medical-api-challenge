import type { Risk } from "./Risk";

export interface RiskStrategy<Subject, RiskType> {
    risk(subject: Subject): Risk<RiskType>;
}