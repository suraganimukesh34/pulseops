import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Dashboard } from './features/dashboards/dashboard/dashboard';
import { PatientsComponent } from './features/patients/pages/patients/patients';
import { Login } from './features/auth/login/login';
import { authGaurd } from './core/gaurds/auth.gaurd';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },

    {
        path: '',
        component: Shell,
        canActivate: [authGaurd],
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
