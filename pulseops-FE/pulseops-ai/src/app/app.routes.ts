import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Dashboard } from './features/dashboards/dashboard/dashboard';
import { PatientsComponent } from './features/patients/pages/patients/patients';
import { DepartmentsComponent } from './features/departments/pages/departments/departments';
import { StaffComponent } from './features/staff/pages/staff/staff';
import { AppointmentsComponent } from './features/appointments/pages/appointments/appointments';
import { BedsComponent } from './features/beds/pages/beds/beds';
import { AlertsComponent } from './features/alerts/pages/alerts/alerts';
import { BillingComponent } from './features/billing/pages/billing/billing';
import { InventoryComponent } from './features/inventory/pages/inventory/inventory';
import { ReportsComponent } from './features/reports/pages/reports/reports';
import { SettingsComponent } from './features/settings/pages/settings/settings';
import { CopilotComponent } from './features/ai-copilot/pages/copilot/copilot';
import { Login } from './features/auth/login/login';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },

    {
        path: '',
        component: Shell,
        canActivate: [authGuard],
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
            {
                path: 'departments',
                component: DepartmentsComponent
            },
            {
                path: 'staff',
                component: StaffComponent
            },
            {
                path: 'appointments',
                component: AppointmentsComponent
            },
            {
                path: 'beds',
                component: BedsComponent
            },
            {
                path: 'alerts',
                component: AlertsComponent
            },
            {
                path: 'billing',
                component: BillingComponent
            },
            {
                path: 'inventory',
                component: InventoryComponent
            },
            {
                path: 'reports',
                component: ReportsComponent
            },
            {
                path: 'settings',
                component: SettingsComponent
            },
            {
                path: 'copilot',
                component: CopilotComponent
            },

        ]
    }
];
