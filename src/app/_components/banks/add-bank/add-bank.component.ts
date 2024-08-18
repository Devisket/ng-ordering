import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BanksService } from '../../../_services/banks.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-bank',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './add-bank.component.html',
  styleUrl: './add-bank.component.css'
})
export class AddBankComponent {
  @ViewChild('addBankForm') addBankForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.addBankForm?.dirty) {
      $event.returnValue = true;
    }
  }

  private router = inject(Router);
  private bankService = inject(BanksService);
  private toastr = inject(ToastrService);
  model: any = {};

  addBank() {
    this.bankService.addBank(this.addBankForm?.value).subscribe({
      next: _ => {
        this.toastr.success("Bank has been added successsfully");
        this.bankService.getBanks();
        this.router.navigateByUrl('/banks');
      },
      error: error => this.toastr.error("Not saved")
    })
  }

}