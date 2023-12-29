
import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { AfterLoginComponent } from "src/app/shared/after-login/after-login.component";
import { MdOrganizationModel } from "src/app/shared/model/md-organization.model";
import { MdOrganizationService } from "src/app/shared/services/md-organization.service";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { ConfirmationDialogService } from "src/app/shared/services/confirmation-dialog.service";
import { MdStateService } from "src/app/shared/services/md-state.service";
import { TokenLocalStorageService } from "src/app/shared/tokenLocalStorage/tokenLocalStorageService";
import { CommonFunctionServices } from "src/app/shared/common/commonFunction.services";

declare const $: any;

@Component({
  selector: "app-md-organization",
  templateUrl: "./md-organization.component.html",
  styleUrls: ["./md-organization.component.css"]
})
export class MdOrganizationComponent implements OnInit {
  submitted: boolean = false;
  updatehdn: boolean = false;
  mdorganizationFrmGroup: FormGroup;
  mdorganizationModel: MdOrganizationModel;
  mdorganizationList: MdOrganizationModel[];
  stateData: any[];
  token: any;

  constructor(private commonFunctionServices: CommonFunctionServices, private storage: TokenLocalStorageService, private stateServices: MdStateService, private confirmationDialogService: ConfirmationDialogService, private formBuilder: FormBuilder, private loader: AfterLoginComponent, private mdorganizationServices: MdOrganizationService, private toastrService: ToastrService) {
    this.mdorganizationFrmGroup = this.formBuilder.group({
      organizationId: ["", [Validators.required, Validators.maxLength(3), Validators.minLength(1), Validators.pattern('^[0-9]*$')]],
      organizationName: ['', Validators.compose([Validators.required, this.scriptValidator])],
      stateId: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.token = this.storage.get('token');
    this.getAll();
    this.getState();
    this.token = this.storage.get('token');
    this.loader.isLoading = false;
  }

  ngAfterViewInit(): void {
  }

  get mdorganizationFrmControl() {
    return this.mdorganizationFrmGroup.controls;
  }
  getState() {
    this.stateServices.getAll().subscribe((data: any) => {
      this.stateData = data;
      this.commonFunctionServices.bindDataTable("mdorganizationGrid", 0);
    })
  }
  save() {
    this.submitted = true;
    if (this.mdorganizationFrmGroup.valid) {
      this.loader.isLoading = true;
      const organizationmodel = {
        organizationId: this.mdorganizationFrmGroup.get("organizationId").value,
        organizationName: this.mdorganizationFrmGroup.get("organizationName").value,
        stateId: this.mdorganizationFrmGroup.get("stateId").value,
      }
      this.mdorganizationServices.insert(organizationmodel).subscribe({
        next: (data: any) => {
          const message = data;
          this.commonFunctionServices.bindDataTable("mdorganizationGrid", 0);
          this.loader.isLoading = true;
          this.clearmdorganizationFrmGroup()
          this.getAll();
          this.getState();
          this.toastrService.success("Data Saved Successfully");
        },

        error: (err: any) => {
          const message = err.message;
          this.loader.isLoading = false;
          this.getAll();
          this.toastrService.error("Already exists");
          this.clearmdorganizationFrmGroup();
          this.getState();
        }
      })
    }
  }

  clearmdorganizationFrmGroup() {
    this.mdorganizationFrmGroup.reset();
    this.submitted = false;
  }
  edit(data: any) {
    this.updatehdn = true;
    this.mdorganizationFrmGroup.controls['stateId'].disable();
    this.mdorganizationFrmGroup.controls['organizationId'].disable();
    this.mdorganizationFrmGroup.patchValue({
      organizationId: data.organizationId,
      organizationName: data.organizationName,
      stateId: data.stateId
    },
    )
  }
  cancel() {
    this.updatehdn = false;
    this.clearmdorganizationFrmGroup()
    this.getState();
    this.mdorganizationFrmGroup.controls['stateId'].enable();
    this.mdorganizationFrmGroup.controls['organizationId'].enable();
  }
  update() {

    this.submitted = true;
    if (this.mdorganizationFrmGroup.valid) {
      this.mdorganizationModel = {
        organizationId: this.mdorganizationFrmGroup.get("organizationId").value,
        organizationName: this.mdorganizationFrmGroup.get("organizationName").value,
        stateId: this.mdorganizationFrmGroup.get("stateId").value,
        stateName: ""
      }
      this.confirmationDialogService.confirmPopUp("Do you really want to Update?")
      .then(confirmed => {
        if (confirmed == true) {
          {
            this.loader.isLoading = true;
            this.mdorganizationServices.update(this.mdorganizationModel).subscribe((data: any) => {
              const message = data;
              
              this.commonFunctionServices.bindDataTable("mdorganizationGrid", 0);
              this.loader.isLoading = false;
              this.getAll();
              this.mdorganizationFrmGroup.controls['organizationId'].enable();
              this.clearmdorganizationFrmGroup();
              this.mdorganizationFrmGroup.controls['stateId'].enable();
              this.mdorganizationFrmGroup.controls['organizationId'].enable();
              this.getState();
              this.updatehdn=false;
              if (message != "Try Again") {
                  this.toastrService.success("Update Successfully");
                }
                if (message == "Try Again") {
                  this.loader.isLoading=false;
                  this.toastrService.error("Error Occured");
                }
              })
            }
          }
        })
    }
  }
  delete(id: any) {
    // this.confirmationDialogService.confirmPopUp("Do you really want to Delete ?")
    //   .then(confirmed => {
    //     if (confirmed == true) {
    //       {
    //         this.mdorganizationServices.delete(id).subscribe((data: any) => {
    //           const message = data;
    //           this.commonFunctionServices.bindDataTable("mdorganizationGrid", 0);
    //           this.toastrService.error(message);
    //           this.loader.isLoading = true;
    //           this.getAll();
    //           this.cancel();
    //         });
    //       }
    //     }
    //   })
  }
  getAll() {
    this.mdorganizationServices.getAll().subscribe((data: any) => {
      this.mdorganizationList = data;

      this.commonFunctionServices.bindDataTable("mdorganizationGrid", 0);
      this.loaderTimeOut();
    })
  }
  scriptValidator = function (control: AbstractControl): ValidationErrors | null {
    let value: string = control.value || '';
    if (value) {
      const matches = (value.includes('<script>')) || (value.includes('</script>')) || (value.includes('<style>')) || (value.includes('</style>'));
      return !matches ? null : { invalid: true };
    } else {
      return null;
    }
  }

  loaderTimeOut() {
    setTimeout(() => {
      this.loader.isLoading = false;
    }, 1000);
  }
}

