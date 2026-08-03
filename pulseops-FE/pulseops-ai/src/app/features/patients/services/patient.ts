
import { Injectable } from '@angular/core';
import { Patient } from '../models/patient.model';

@Injectable({
    providedIn: 'root'
})
export class PatientService {

    getPatients(): Patient[] {

        return [

            {
                id: 'P1001',
                name: 'John Doe',
                age: 45,
                gender: 'Male',
                department: 'ICU',
                ward: 'Ward A',
                bed: 'ICU-12',
                doctor: 'Dr. Smith',
                nurse: 'Emily',
                status: 'Critical',
                priority: 'High',
                admissionTime: '09:20 AM',
                expectedDischarge: '05 Aug'
            },
            {
                id: 'P1002',
                name: 'Max ',
                age: 45,
                gender: 'Male',
                department: 'ICU',
                ward: 'Ward A',
                bed: 'ICU-12',
                doctor: 'Dr. Smith',
                nurse: 'Emily',
                status: 'Critical',
                priority: 'High',
                admissionTime: '09:20 AM',
                expectedDischarge: '05 Aug'
            },
            {
                id: 'P1003',
                name: 'Mike',
                age: 45,
                gender: 'Male',
                department: 'ICU',
                ward: 'Ward A',
                bed: 'ICU-12',
                doctor: 'Dr. Smith',
                nurse: 'Emily',
                status: 'Critical',
                priority: 'High',
                admissionTime: '09:20 AM',
                expectedDischarge: '05 Aug'
            },

            {
                id: 'P1004',
                name: 'Sarah Kim',
                age: 29,
                gender: 'Female',
                department: 'Cardiology',
                ward: 'Ward C',
                bed: 'C-210',
                doctor: 'Dr. Wilson',
                nurse: 'Anna',
                status: 'Stable',
                priority: 'Medium',
                admissionTime: '11:10 AM',
                expectedDischarge: '06 Aug'
            }

        ];

    }

}
