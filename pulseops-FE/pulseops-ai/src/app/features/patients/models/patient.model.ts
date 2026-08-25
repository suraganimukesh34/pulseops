export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;

    department: string;
    ward: string;
    bed: string;

    status: string;
    priority: string;

    admission_date: string;
    expected_discharge_date: string;

    attending_doctor: string;
    diagnosis: string;
    symptoms: string;

    contact_number: string;
    blood_group: string;

}

export interface PatientCreate {
    name: string;
    age: number;
    gender: string;

    department: string;
    ward: string;
    bed: string;

    status: string;
    priority: string;

    admission_date: string;
    expected_discharge_date: string;

    attending_doctor: string;
    diagnosis: string;
    symptoms: string;

    contact_number: string;
    blood_group: string;

}

export interface AIPatientSummaryResponse {
    patient_id: string;
    patient_summary: string;
}
