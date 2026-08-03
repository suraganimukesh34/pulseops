import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Dashboard } from './features/dashboards/dashboard/dashboard';
import { PatientsComponent } from './features/patients/pages/patients/patients';

export const routes: Routes = [

    {
        path: '',
        component: Shell,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: Dashboard
            },
            {
                path: 'patients',
                component: PatientsComponent
            },

        ]
    }
];
