import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BedService } from '../../services/bed.service';
import { Bed } from '../../models/bed.model';
import { DepartmentService } from '../../../departments/services/department.service';
import { Department } from '../../../departments/models/department.model';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { PageHeaderService } from '../../../../core/services/page-header';
import { AddBedDialog } from '../../components/add-bed-dialog/add-bed-dialog';
import { AdmitBedDialog } from '../../components/admit-bed-dialog/admit-bed-dialog';
import { badgeClass } from '../../../../shared/utils/badge.util';

@Component({
  selector: 'app-beds',
  standalone: true,
  imports: [CommonModule, StatCard, MatTableModule],
  templateUrl: './beds.html',
  styleUrl: './beds.scss',
})
export class BedsComponent implements OnInit {
  beds: Bed[] = [];
  departments: Department[] = [];
  badgeClass = badgeClass;

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
    this.bedService.getBeds().subscribe({
      next: (beds) => {
        this.beds = beds;
        this.dataSource.data = beds;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load beds', error),
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
        this.loadBeds();
      }
    });
  }

  releaseBed(bed: Bed): void {
    this.bedService.releaseBed(bed.id).subscribe({
      next: () => this.loadBeds(),
      error: (error) => console.error('Failed to release bed', error),
    });
  }
}
