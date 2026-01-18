import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Organization } from '../../core/models/organization.interface';
import { OrganizationService } from '../../core/services/organization.service';
import { ToastService } from '../../core/services/toast.service';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private organizationService = inject(OrganizationService);
  private toast = inject(ToastService);

  currentOrganization = signal<Organization | null>(null);

  settingsForm = this.fb.group({
    legalName: ['', [Validators.required, Validators.minLength(2)]],
    fiscalId: [{ value: '', disabled: true }], // Fiscal ID cannot be updated
    industrySector: [''],
    defaultCurrency: ['USD'],
    distanceUnit: ['km'],
    volumeUnit: ['liters'],
  });

  ngOnInit(): void {
    this.loadOrganizationData();
  }

  loadOrganizationData() {
    this.organizationService.getMyOrganization().subscribe({
      next: (org) => {
        this.currentOrganization.set(org);
        this.settingsForm.patchValue({
          legalName: org.legalName,
          fiscalId: org.fiscalId,
          industrySector: org.industrySector!,
          defaultCurrency: org.defaultCurrency,
          distanceUnit: org.distanceUnit,
          volumeUnit: org.volumeUnit,
        });
      },
      error: (err) => {
        console.error('Error loading organization:', err);
      },
    });
  }

  setDistanceUnit(unit: 'km' | 'miles') {
    this.settingsForm.patchValue({ distanceUnit: unit });
  }

  setVolumeUnit(unit: 'liters' | 'gallons') {
    this.settingsForm.patchValue({ volumeUnit: unit });
  }

  saveSettings() {
    if (this.settingsForm.invalid || !this.currentOrganization()) return;

    const updatedData = this.settingsForm.getRawValue(); // Use getRawValue to include disabled fiscalId if needed, though we only update others
    const request: Partial<Organization> = {
      legalName: updatedData.legalName!,
      industrySector: updatedData.industrySector!,
      defaultCurrency: updatedData.defaultCurrency as any,
      distanceUnit: updatedData.distanceUnit as any,
      volumeUnit: updatedData.volumeUnit as any,
    };

    this.organizationService.updateOrganization(this.currentOrganization()!.id, request).subscribe({
      next: (response) => {
        this.currentOrganization.set(response.organization);
        this.toast.success('Settings updated successfully!');
      },
      error: (err) => {
        console.error('Error updating organization:', err);
        this.toast.error('Failed to update settings. Please try again.');
      },
    });
  }
}
