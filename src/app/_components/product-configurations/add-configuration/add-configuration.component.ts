import { Component, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BanksService } from '../../../_services/banks.service';
import { Bank } from '../../../_models/bank';
import { ProductTypeService } from '../../../_services/product-type.service';
import { ProductType } from '../../../_models/product-type';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductConfigurationService } from '../../../_services/product-configuration.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-configuration',
  standalone: true,
  imports: [FormsModule, NgxEditorModule],
  templateUrl: './add-configuration.component.html',
  styleUrl: './add-configuration.component.css'
})
export class AddConfigurationComponent implements OnInit, OnDestroy {

  @ViewChild('addProductConfigurationForm') addProductConfigurationForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if (this.addProductConfigurationForm?.dirty) {
      $event.returnValue = true;
    }
  }

  route = inject(ActivatedRoute)
  bankService = inject(BanksService);
  productTypeService = inject(ProductTypeService);
  productConfigurationService = inject(ProductConfigurationService);
  toastr = inject(ToastrService);
  router = inject(Router);
  bankInfo?: Bank;
  productType?: ProductType;
  editor: Editor  = new Editor();
  model: any = {
    "configurationType": 0
  };

  ngOnInit(): void {
    this.loadBank();
    this.getProductType();
  }

  loadBank() {
    let bankId = this.route.snapshot.paramMap.get("bankId");
    if (!bankId) return;
    this.bankService.getBanks().subscribe(data => {
      this.bankInfo = data.bankInfos.find((bank: Bank) => bank.id === bankId);
    });
  }


  getProductType(){
    let productTypeId = this.route.snapshot.paramMap.get("productId");
    let bankId = this.route.snapshot.paramMap.get("bankId");
    this.productTypeService.getProductTypes(bankId).subscribe( data => {
      this.productType = data.productTypes.find((product: ProductType) => product.productTypeId === productTypeId);
    })
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  addProductConfiguration() {
    const values = this.addProductConfigurationForm?.value;

    const configurationData = JSON.stringify(values.configurationData)

    const request = {
      "configurationData": configurationData,
      "fileName": values.fileName,
      "configurationType": values.configurationType,
    };

    this.productConfigurationService.addProductConfigurations(this.productType?.productTypeId, this.bankInfo?.id, request).subscribe({
      next: _ => {
        this.toastr.success( this.productType?.productTypeName + " configuration has been added successsfully");
        this.router.navigateByUrl('/banks/' + this.bankInfo?.id);
      },
      error: error => this.toastr.error("Not saved")
    })
  }
}