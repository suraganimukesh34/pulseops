import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/appointment.model';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { PageHeaderService } from '../../../../core/services/page-header';
import { AddAppointmentDialog } from '../../components/add-appointment-dialog/add-appointment-dialog';
import { badgeClass } from '../../../../shared/utils/badge.util';
import { Department } from '../../../departments/models/department.model';
import { DepartmentService } from '../../../departments/services/department.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, StatCard, MatTableModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss',
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  departments: Department[] = [];
  badgeClass = badgeClass;

  displayedColumns: string[] = [
    'date',
    'time',
    'patient_name',
    'doctor_name',
    'department',
    'status',
    'reason',
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
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.dataSource.data = appointments;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load appointments', error),
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
        this.loadAppointments();
      }
    });
  }
}
