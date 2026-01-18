import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateOrganizationRequest } from '../models/organization.interface';
import { OrganizationService } from '../services/organization.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private organizationService = inject(OrganizationService);
  private toast = inject(ToastService);

  currentStep = signal(1);
  totalSteps = 3;

  onboardingForm = this.fb.group({
    companyInfo: this.fb.group({
      businessName: ['', Validators.required],
      fiscalId: ['', Validators.required],
      sector: ['', Validators.required],
      location: ['', Validators.required],
    }),
    facilities: this.fb.array([this.createFacilityGroup()]),
  });

  get facilities() {
    return this.onboardingForm.get('facilities') as FormArray;
  }

  createFacilityGroup() {
    return this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  addFacility() {
    this.facilities.push(this.createFacilityGroup());
  }

  removeFacility(index: number) {
    if (this.facilities.length > 1) {
      this.facilities.removeAt(index);
    }
  }

  nextStep() {
    if (this.currentStep() === 1) {
      if (this.onboardingForm.get('companyInfo')?.invalid) return;

      const companyData = this.onboardingForm.value.companyInfo;
      const request: CreateOrganizationRequest = {
        legalName: companyData?.businessName!,
        fiscalId: companyData?.fiscalId!,
        industrySector: companyData?.sector!,
        geographicLocation: companyData?.location!,
        defaultCurrency: 'USD', // Default
        distanceUnit: 'km', // Default
        volumeUnit: 'liters', // Default
      };

      this.organizationService.createOrganization(request).subscribe({
        next: () => {
          this.toast.success('Organization created successfully!');
          this.currentStep.set(2);
        },
        error: (err) => {
          console.error('Error creating organization:', err);
          this.toast.error('Failed to create organization. Please check your data.');
        },
      });
    } else if (this.currentStep() < this.totalSteps) {
      this.currentStep.update((s) => s + 1);
    } else {
      this.finishOnboarding();
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update((s) => s - 1);
    }
  }

  finishOnboarding() {
    console.log('Onboarding data:', this.onboardingForm.value);
    // TODO: Save data to API when endpoint is available
    this.router.navigate(['/settings']);
  }
}
