import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BedService } from '../../services/bed.service';
import { Bed } from '../../models/bed.model';
import { DepartmentService } from '../../../departments/services/department.service';
import { Department } from '../../../departments/models/department.model';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { PageHeaderService } from '../../../../core/services/page-header';
import { AddBedDialog } from '../../components/add-bed-dialog/add-bed-dialog';
import { AdmitBedDialog } from '../../components/admit-bed-dialog/admit-bed-dialog';
import { badgeClass } from '../../../../shared/utils/badge.util';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-beds',
  standalone: true,
  imports: [CommonModule, StatCard, MatTableModule, MatIconModule],
  templateUrl: './beds.html',
  styleUrl: './beds.scss',
})
export class BedsComponent implements OnInit {
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  beds: Bed[] = [];
  departments: Department[] = [];
  badgeClass = badgeClass;
  isLoading = true;

  displayedColumns: string[] = [
    'department',
    'bed_number',
    'status',
    'patient_id',
    'action',
  ];
  dataSource = new MatTableDataSource<Bed>();

  constructor(
    private bedService: BedService,
    private departmentService: DepartmentService,
    private pageHeader: PageHeaderService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {
    this.pageHeader.setHeader('Beds', 'Bed Management & Occupancy');
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadBeds();
  }

  loadBeds(): void {
    this.isLoading = true;

    this.bedService.getBeds().subscribe({
      next: (beds) => {
        this.beds = beds;
        this.dataSource.data = beds;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load beds', error);
        this.isLoading = false;
        this.notifications.error('Failed to load beds', 'Please try refreshing the page.');
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
    return this.departments.find((d) => d.id === departmentId)?.name ?? '—';
  }

  get totalCount(): number {
    return this.beds.length;
  }

  get availableCount(): number {
    return this.beds.filter((b) => b.status === 'Available').length;
  }

  get occupiedCount(): number {
    return this.beds.filter((b) => b.status === 'Occupied').length;
  }

  openAddBedDialog(): void {
    const dialogRef = this.dialog.open(AddBedDialog, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((bed) => {
      if (bed) {
        this.notifications.success('Bed added successfully', `Bed ${bed.bed_number} has been added.`);
        this.loadBeds();
      }
    });
  }

  openAdmitDialog(bed: Bed): void {
    const dialogRef = this.dialog.open(AdmitBedDialog, {
      width: '480px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
      data: { bedId: bed.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notifications.success('Patient admitted', `Patient has been admitted to bed ${bed.bed_number}.`);
        this.loadBeds();
      }
    });
  }

  releaseBed(bed: Bed): void {
    this.bedService.releaseBed(bed.id).subscribe({
      next: () => {
        this.notifications.success('Bed released', `Bed ${bed.bed_number} is now available.`);
        this.loadBeds();
      },
      error: (error) => {
        console.error('Failed to release bed', error);
        this.notifications.error('Failed to release bed', 'Please try again.');
      },
    });
  }

  openEditBedDialog(bed: Bed): void {
    const dialogRef = this.dialog.open(AddBedDialog, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
      data: { bed },
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.notifications.success('Bed updated successfully', `Bed ${updated.bed_number}'s record has been saved.`);
        this.loadBeds();
      }
    });
  }

  deleteBed(bed: Bed): void {
    this.confirmDialog
      .confirm({
        title: 'Delete Bed',
        message: `Are you sure you want to delete bed "${bed.bed_number}"? This cannot be undone.`,
        confirmLabel: 'Delete',
        danger: true,
      })
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.bedService.deleteBed(bed.id).subscribe({
          next: () => {
            this.notifications.success('Bed deleted', `Bed ${bed.bed_number}'s record has been removed.`);
            this.loadBeds();
          },
          error: (error) => {
            console.error('Failed to delete bed', error);
            this.notifications.error('Failed to delete bed', 'Please try again.');
          },
        });
      });
  }
}
