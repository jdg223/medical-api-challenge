export interface Patient {
    id: string;
    name: string | null;
    age: number | null;
    gender: string | null;
    bloodPressure: string | null;
    temperature: number | null;
    visitDate: string | null;
    diagnosis: string | null;
    medications: string | null;
}