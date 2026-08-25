import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { PageHeaderService } from '../../../../core/services/page-header';
import { AddAppointmentDialog } from '../../components/add-appointment-dialog/add-appointment-dialog';
import { badgeClass } from '../../../../shared/utils/badge.util';
import { Department } from '../../../departments/models/department.model';
import { DepartmentService } from '../../../departments/services/department.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, StatCard, MatTableModule, MatIconModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class AppointmentsComponent implements OnInit {
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  appointments: Appointment[] = [];
  departments: Department[] = [];
  badgeClass = badgeClass;
  isLoading = true;

  displayedColumns: string[] = [
    'date',
    'time',
    'patient_name',
    'doctor_name',
    'department',
    'status',
    'reason',
    'actions',
  ];
  dataSource = new MatTableDataSource<Appointment>();

  constructor(
    private appointmentService: AppointmentService,
    private departmentService: DepartmentService,
    private pageHeader: PageHeaderService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {
    this.pageHeader.setHeader('Appointments', 'Patient Appointment Schedule');
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isLoading = true;

    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.dataSource.data = appointments;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load appointments', error);
        this.isLoading = false;
        this.notifications.error('Failed to load appointments', 'Please try refreshing the page.');
        this.cdr.detectChanges();
      },
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load departments', error),
    });
  }

  departmentName(departmentId: string): string {
    return this.departments.find((d) => d.id === departmentId)?.name ?? departmentId;
  }

  get scheduledCount(): number {
    return this.appointments.filter((a) => a.status === 'Scheduled').length;
  }

  get completedCount(): number {
    return this.appointments.filter((a) => a.status === 'Completed').length;
  }

  openAddAppointmentDialog(): void {
    const dialogRef = this.dialog.open(AddAppointmentDialog, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((appointment) => {
      if (appointment) {
        this.notifications.success('Appointment added successfully', `${appointment.patient_name}'s appointment has been scheduled.`);
        this.loadAppointments();
      }
    });
  }

  openEditAppointmentDialog(appointment: Appointment): void {
    const dialogRef = this.dialog.open(AddAppointmentDialog, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
      data: { appointment },
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.notifications.success('Appointment updated successfully', `${updated.patient_name}'s appointment has been saved.`);
        this.loadAppointments();
      }
    });
  }

  deleteAppointment(appointment: Appointment): void {
    this.confirmDialog
      .confirm({
        title: 'Delete Appointment',
        message: `Are you sure you want to delete this appointment for "${appointment.patient_name}"? This cannot be undone.`,
        confirmLabel: 'Delete',
        danger: true,
      })
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.appointmentService.deleteAppointment(appointment.id).subscribe({
          next: () => {
            this.notifications.success('Appointment deleted', `${appointment.patient_name}'s appointment has been removed.`);
            this.loadAppointments();
          },
          error: (error) => {
            console.error('Failed to delete appointment', error);
            this.notifications.error('Failed to delete appointment', 'Please try again.');
          },
        });
      });
  }
}
