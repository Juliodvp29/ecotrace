import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateFacilityRequest, FacilityType } from '@core/models/facility.interface';
import { CreateOrganizationRequest } from '@core/models/organization.interface';
import { FacilityService } from '@core/services/facility.service';
import { OrganizationService } from '@core/services/organization.service';
import { ToastService } from '@core/services/toast.service';
import { TranslationService } from '@core/services/translation.service';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private organizationService = inject(OrganizationService);
  private facilityService = inject(FacilityService);
  private toast = inject(ToastService);
  public translationService = inject(TranslationService);

  currentStep = signal(0); // Start at 0 while checking state
  totalSteps = 3;
  isLoading = signal(true);

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

  ngOnInit(): void {
    this.checkOnboardingState();
  }

  private checkOnboardingState() {
    this.organizationService.getMyOrganization().subscribe({
      next: (org) => {
        if (org) {
          // Patch existing data so the form group is valid!
          this.onboardingForm.get('companyInfo')?.patchValue({
            businessName: org.legalName,
            fiscalId: org.fiscalId,
            sector: org.industrySector,
            location: org.geographicLocation,
          });
          // Org exists, check facilities
          this.checkFacilitiesState();
        } else {
          this.currentStep.set(1);
          this.isLoading.set(false);
        }
      },
      error: () => {
        // No organization found, stay at Step 1
        this.currentStep.set(1);
        this.isLoading.set(false);
      },
    });
  }

  private checkFacilitiesState() {
    this.facilityService.getFacilities().subscribe({
      next: (facilities) => {
        if (facilities && facilities.length > 0) {
          // Both complete, go to dashboard
          this.router.navigate(['/dashboard']);
        } else {
          // Org exists but no facilities, go to Step 2
          this.currentStep.set(2);
          this.isLoading.set(false);
        }
      },
      error: () => {
        // Error checking facilities, assume Step 2
        this.currentStep.set(2);
        this.isLoading.set(false);
      },
    });
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
        language: this.translationService.currentLanguage(),
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
    } else if (this.currentStep() === 2) {
      if (this.facilities.invalid) return;

      const facilitiesData = this.onboardingForm.value.facilities as any[];

      this.toast.info('Saving facilities and checking locations...');

      const facilityRequests = facilitiesData.map((fac) => {
        // First geocode, then create
        return this.facilityService.geocode(fac.address).pipe(
          catchError(() => of(null)), // If geocode fails, continue without coordinates
          switchMap((geo) => {
            const request: CreateFacilityRequest = {
              name: fac.name,
              facilityType: fac.type as FacilityType,
              address: fac.address,
              latitude: geo?.latitude,
              longitude: geo?.longitude,
              gridRegion: geo?.gridRegion,
            };
            return this.facilityService.createFacility(request);
          }),
        );
      });

      forkJoin(facilityRequests).subscribe({
        next: () => {
          this.toast.success('All facilities saved successfully!');
          this.currentStep.set(3);
        },
        error: (err: any) => {
          console.error('Error saving facilities:', err);
          this.toast.error('Some facilities could not be saved. Please try again.');
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
    // If we are at Step 2 and have data, but chose to exit, we go to settings
    if (this.currentStep() === 2) {
      this.router.navigate(['/settings']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
