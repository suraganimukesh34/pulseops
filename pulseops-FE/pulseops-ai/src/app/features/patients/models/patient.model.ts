export interface Patient {

    id: string;

    name: string;

    age: number;

    gender: 'Male' | 'Female';

    department: string;

    ward: string;

    bed: string;

    doctor: string;

    nurse: string;

    status: 'Critical' | 'Stable' | 'Waiting';

    priority: 'High' | 'Medium' | 'Low';

    admissionTime: string;

    expectedDischarge: string;

}
