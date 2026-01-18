import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from '@core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-center gap-3 min-w-[320px] max-w-md p-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-toast-in"
          [ngClass]="getToastClasses(toast.type)"
        >
          <div
            class="flex items-center justify-center size-10 rounded-xl bg-white/20 dark:bg-black/10 shadow-inner"
          >
            <span class="material-symbols-outlined text-[24px]">
              {{ getIcon(toast.type) }}
            </span>
          </div>

          <div class="flex-1">
            <p class="text-sm font-bold tracking-tight">{{ getTitle(toast.type) }}</p>
            <p class="text-xs opacity-90 leading-relaxed">{{ toast.message }}</p>
          </div>

          <button
            (click)="toastService.remove(toast.id)"
            class="size-6 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
          >
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes toast-in {
        from {
          transform: translateX(100%) scale(0.9);
          opacity: 0;
        }
        to {
          transform: translateX(0) scale(1);
          opacity: 1;
        }
      }
      .animate-toast-in {
        animation: toast-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }
    `,
  ],
})
export class ToastComponent {
  toastService = inject(ToastService);

  getToastClasses(type: ToastType) {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/90 border-emerald-400/30 text-white shadow-emerald-500/20';
      case 'error':
        return 'bg-rose-500/90 border-rose-400/30 text-white shadow-rose-500/20';
      case 'warning':
        return 'bg-amber-500/90 border-amber-400/30 text-white shadow-amber-500/20';
      case 'info':
        return 'bg-sky-500/90 border-sky-400/30 text-white shadow-sky-500/20';
      default:
        return 'bg-slate-800/90 border-slate-700/30 text-white shadow-slate-900/20';
    }
  }

  getIcon(type: ToastType) {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  }

  getTitle(type: ToastType) {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Notification';
      default:
        return 'Notification';
    }
  }
}
