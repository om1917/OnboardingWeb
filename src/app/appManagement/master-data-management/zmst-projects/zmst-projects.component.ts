import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AfterLoginComponent } from "src/app/shared/after-login/after-login.component";
import { ZmstProjectsModel } from "src/app/shared/model/zmst-projects.model";
import { ZmstProjectsService } from "src/app/shared/services/zmst-projects.service";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { ConfirmationDialogService } from "src/app/shared/services/confirmation-dialog.service";
import { AgencyServices } from 'src/app/shared/services/agencyServices';
import { ZmstAgencyExamCouns } from 'src/app/shared/services/zmstAgencyExamCouns';
import { ServicesModel } from 'src/app/shared/model/serviceModel';
import { ZmstServiceTypeService } from 'src/app/shared/services/zmst-service-type.service';
import { CommonFunctionServices } from 'src/app/shared/common/commonFunction.services';
import { MdYearServices } from 'src/app/shared/services/md-YearService';
import { MdYearEnum } from 'src/app/shared/common/enums/yearGroup.enums';
import { MdYearModel } from 'src/app/shared/model/md-YearModel';
declare const $: any;
@Component({
  selector: 'app-zmst-projects',
  templateUrl: './zmst-projects.component.html',
  styleUrls: ['./zmst-projects.component.css']
})

export class ZmstProjectsComponent implements OnInit {
  submitted: boolean = false;
  updatehdn: boolean = false;
  rowData: any;
  Agencydata: any = [];
  examcode: any[] = [];
  agencyid: string;
  servicesdata: ServicesModel[] = [];
  projectCycles: FormGroup;
  serviceid: string;
  projectName: string;
  examcodeID: string;
  academicYear: any;
  date: any;
  agencyName: string;
  zmstprojectsFrmGroup: FormGroup;
  zmstprojectsModel: ZmstProjectsModel;
  zmstprojectsList: ZmstProjectsModel[];
  examCodeEdit: any = [];
  check: any;
  Years:MdYearModel[];

  constructor(private commonFunctionServices: CommonFunctionServices, private formBuilder: FormBuilder, private loader: AfterLoginComponent, private ZmstAgencyExamCoun: ZmstAgencyExamCouns, private zmstServiceTypeService: ZmstServiceTypeService, private confirmationDialogService: ConfirmationDialogService, private zmstprojectsServices: ZmstProjectsService, private agencyUser: AgencyServices, private toastrService: ToastrService, private mdYearService:MdYearServices) {
    this.zmstprojectsFrmGroup = this.formBuilder.group({
      agencyId: ["", [Validators.required]],
      examCounsid: ["", [Validators.required]],
      academicYear: ["", [Validators.required]],
      serviceType: ["", [Validators.required]],
      attempt: ["", [Validators.required]],
      projectId: ["", [Validators.required]],
      projectName: ["", [Validators.required]],
      description: ["",],
      requestLetter: ["",],
      createdDate: ["",],
      createdBy: ["",],
      modifiedDate: ["",],
      modifiedBy: ["",],
      isLive: ["", [Validators.required]],
      pInitiated: ["", [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.loader.isLoading = true;
    this.getAll();
    this.getOnboardingRequestYear();
    this.zmstprojectsFrmControl.examCounsid.setValue(0);
    this.zmstprojectsFrmControl.isLive.setValue(0);
    this.zmstprojectsFrmControl.pInitiated.setValue(0);
    this.zmstprojectsFrmControl.academicYear.setValue(0);
    this.zmstprojectsFrmGroup.controls['projectId'].disable();
    this.agencyUser.getAll().subscribe((data: any) => {
      this.Agencydata = data;
    })
    this.zmstServiceTypeService.getAll().subscribe((data: any) => {
      this.servicesdata = data;
    });
  }

  ngAfterViewInit(): void {

  }


  get zmstprojectsFrmControl() {
    return this.zmstprojectsFrmGroup.controls;
  }
  reset() {
    this.clear()
  }
  clear() {
    this.zmstprojectsFrmGroup.reset();
    this.zmstprojectsFrmControl.examCounsid.setValue(0);
    this.zmstprojectsFrmControl.isLive.setValue(0);
    this.zmstprojectsFrmControl.pInitiated.setValue(0);
    this.zmstprojectsFrmControl.academicYear.setValue(0);
    this.agencyUser.getAll().subscribe((data: any) => {
    this.Agencydata = data;
    })
    this.zmstServiceTypeService.getAll().subscribe((data: any) => {
      this.servicesdata = data;
    });
    this.zmstprojectsFrmGroup.controls['agencyId'].enable();
    this.submitted = false;
    this.updatehdn = false;
  }
  getOnboardingRequestYear(){
    
    this.loader.isLoading = true;
    this.mdYearService
      .getById(MdYearEnum.Onboarding_Project).subscribe({next:(res) => {
        this.Years = res;
        this.loader.isLoading = false;
      },error:(err:any)=>{
        this.toastrService.error(err);
        this.loader.isLoading = false;
      }});
    }
  save() {
    this.submitted = true;
    if (this.zmstprojectsFrmGroup.valid) {
      const zmstprojectsModel = {
        agencyId: this.zmstprojectsFrmGroup.get("agencyId").value,
        examCounsid: this.zmstprojectsFrmGroup.get("examCounsid").value,
        academicYear: this.zmstprojectsFrmGroup.get("academicYear").value,
        serviceType: this.zmstprojectsFrmGroup.get("serviceType").value,
        attempt: this.zmstprojectsFrmGroup.get("attempt").value,
        projectId: this.zmstprojectsFrmGroup.get("projectId").value,
        projectName: this.zmstprojectsFrmGroup.get("projectName").value,
        description: this.zmstprojectsFrmGroup.get("description").value,
        requestLetter: this.zmstprojectsFrmGroup.get("requestLetter").value,
        created_date: this.zmstprojectsFrmGroup.get("createdDate").value,
        created_by: this.zmstprojectsFrmGroup.get("createdBy").value,
        modified_date: this.zmstprojectsFrmGroup.get("modifiedDate").value,
        modified_by: this.zmstprojectsFrmGroup.get("modifiedBy").value,
        isLive: this.zmstprojectsFrmGroup.get("isLive").value,
        pInitiated: this.zmstprojectsFrmGroup.get("pInitiated").value,
      }

      this.confirmationDialogService.confirmPopUp("Do you really want to Save?")
        .then(confirmed => {
          if (confirmed == true) {
            {
              this.loader.isLoading = true;
              this.zmstprojectsServices.insert(zmstprojectsModel).subscribe((data: any) => {
                const message = data;
                this.getAll();
                this.clear();
                this.toastrService.success("Data Saved Successfully");
              })
            }
          }
        })
    }
  }
  edit(data: any) {
    this.examcode = [];
    this.ZmstAgencyExamCoun.bindZmstAgencyExamCouns(data.agencyId).subscribe((record: any) => {
      this.examcode = record;
      this.updatehdn = true;
      this.examcodeID=data.examCounsid;
      this.agencyid=data.agencyId;
      this.zmstprojectsFrmGroup.controls['agencyId'].disable();
      this.zmstprojectsFrmGroup.patchValue({
        agencyId: data.agencyId,
        examCounsid: data.examCounsid,
        academicYear: data.academicYear,
        serviceType: data.serviceType,
        attempt: data.attempt,
        projectId: data.projectId,
        projectName: data.projectName,
        description: data.description,
        requestLetter: data.requestLetter,
        createdDate: data.createdDate,
        createdBy: data.createdBy,
        modifiedDate: data.modifiedDate,
        modifiedBy: data.modifiedBy,
        isLive: data.isLive,
        pInitiated: data.pinitiated,
      },
      )
    }
    )
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }
  update() {
    if (this.zmstprojectsFrmGroup.valid) {
      const zmstprojectsModel = {
        agencyId: this.zmstprojectsFrmGroup.get("agencyId").value,
        examCounsid: this.zmstprojectsFrmGroup.get("examCounsid").value,
        academicYear: this.zmstprojectsFrmGroup.get("academicYear").value,
        serviceType: this.zmstprojectsFrmGroup.get("serviceType").value,
        attempt: this.zmstprojectsFrmGroup.get("attempt").value,
        projectId: this.zmstprojectsFrmGroup.get("projectId").value,
        projectName: this.zmstprojectsFrmGroup.get("projectName").value,
        description: this.zmstprojectsFrmGroup.get("description").value,
        requestLetter: this.zmstprojectsFrmGroup.get("requestLetter").value,
        createdDate: this.zmstprojectsFrmGroup.get("createdDate").value,
        createdBy: this.zmstprojectsFrmGroup.get("createdBy").value,
        modifiedDate: this.zmstprojectsFrmGroup.get("modifiedDate").value,
        modifiedBy: this.zmstprojectsFrmGroup.get("modifiedBy").value,
        isLive: this.zmstprojectsFrmGroup.get("isLive").value,
        pInitiated: this.zmstprojectsFrmGroup.get("pInitiated").value,
      }
      this.confirmationDialogService.confirmPopUp("Do you really want to Update?")
        .then(confirmed => {
          if (confirmed == true) {
            {
              this.loader.isLoading = true;
              this.zmstprojectsServices.update(zmstprojectsModel).subscribe((data: any) => {
                const message = data;
                this.loader.isLoading = false;
                this.getAll();
                this.updatehdn = false;
                this.clear();
                this.zmstprojectsFrmGroup.controls['agencyId'].enable();
                this.toastrService.success(message);
              })
            }
          }
        })
    }
  }
  delete(id: any) {
    this.confirmationDialogService.confirmPopUp("Do you really want to Delete ?")
      .then(confirmed => {
        if (confirmed == true) {
          {
            this.loader.isLoading = true;
            this.zmstprojectsServices.delete(id.toString()).subscribe((data: any) => {
              this.loader.isLoading = false;
              const message = data;
              this.toastrService.error(message);
              this.clear();
              this.getAll();
            })
          }
        }
      })
  }

  getAll() {
    this.zmstprojectsServices.getAll().subscribe((data: any) => {
      this.zmstprojectsList = data;
      this.commonFunctionServices.bindDataTable("zmstprojectsGrid", 0);
      this.loaderTimeOut();
    })
  }
  onSelectAgency(event: any) {
    
    this.ZmstAgencyExamCoun.bindZmstAgencyExamCouns(event.target.value).subscribe((data: any) => {
      this.examcode = data;
    })
  }
  generateCycleId() {
    this.zmstprojectsFrmGroup.patchValue({
      projectId: (this.agencyid.toString() + this.examcodeID.toString() + this.zmstprojectsFrmGroup.get("academicYear").value.toString() + this.zmstprojectsFrmGroup.get('serviceType').value + this.zmstprojectsFrmGroup.get('attempt').value.toString()).toString(),
    });
  }
  onselectExamcode(event: any) {
    
    this.examcodeID = event.target.value;
    this.projectName = this.examcode.filter((item => Number(item.examCounsId) === Number(event.target.value)))[0].description;
    this.agencyid = this.examcode.filter((item => Number(item.examCounsId) === Number(event.target.value)))[0].agencyId;
    this.zmstprojectsFrmGroup.patchValue({
      projectName: this.projectName,
    });
    if (this.zmstprojectsFrmGroup.get('serviceType').value != "" && this.zmstprojectsFrmGroup.get('academicYear').value != "" && this.zmstprojectsFrmGroup.get('attempt').value != "") {
      this.generateCycleId()
    }
    else {
      return
    }
  }
  onselectservices(event: any) {
    if (this.zmstprojectsFrmGroup.get('serviceType').value == "Examination Management") {
      this.serviceid = "1"
    }
    if (this.zmstprojectsFrmGroup.get('serviceType').value == "E-Counselling and Admission") {
      this.serviceid = "2"
    }
    if (this.examcodeID.toString() != "" && this.zmstprojectsFrmGroup.get('academicYear').value != "" && this.zmstprojectsFrmGroup.get('attempt').value != "") {
      this.generateCycleId()
    }
    else {
      return
    }
  }
  onattemptchange(event: any) {

    if (this.examcodeID.toString() != "" && this.zmstprojectsFrmGroup.get('serviceType').value != "" && this.zmstprojectsFrmGroup.get('academicYear').value != "") {
      this.generateCycleId();
    }
    else {
      return
    }
  }
  OnselectAcademics() {
    if (this.examcodeID.toString() != "" && this.zmstprojectsFrmGroup.get('serviceType').value != "" && this.zmstprojectsFrmGroup.get('attempt').value != "") {
      this.generateCycleId();
    }
    else {
      return
    }
  }
  loaderTimeOut() {
    setTimeout(() => {
      this.loader.isLoading = false;
    }, 1000);
  }
}
