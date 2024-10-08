import { Component, inject, input, OnInit } from '@angular/core';
import { Bank } from '../../../_models/bank';
import { Batch } from '../../../_models/batch';
import { ToastrService } from 'ngx-toastr';
import { BatchesService } from '../../../_services/batches.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-batch-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './batch-list.component.html',
  styleUrl: './batch-list.component.css'
})
export class BatchListComponent implements OnInit{

  private batchServices = inject(BatchesService);
  bankInfo = input.required<Bank>();
  batches: Batch[] = [];
  batch?: Batch;
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.bankInfo;
    this.getBatches();
  }

  getBatches(){
    const bankId = this.bankInfo().id;
    this.batchServices.getBatches(bankId).subscribe(data => {
      if(!data) return;
      this.batches = data.batchFiles;
    });
  }

}