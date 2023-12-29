
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenLocalStorageService } from 'src/app/shared/tokenLocalStorage/tokenLocalStorageService';
import { ConfirmationDialogService } from 'src/app/shared/services/confirmation-dialog.service';
import { MultiSelectDropdown } from 'src/app/shared/model/multiSelectDropdownModel';
import { Documents } from 'src/app/shared/model/documentsModel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AfterLoginComponent } from 'src/app/shared/after-login/after-login.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, formatDate } from '@angular/common';
import { AppDocumentUploadDetailService } from 'src/app/shared/services/appDocumentUploadedDetailService';
import { DocumentTypeService } from 'src/app/shared/services/documentTypeService';
import { ZmstProjectServices } from 'src/app/shared/services/ZmstProjectServices';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppDocFilter } from 'src/app/shared/model/appDocFilterModel';
import { ActivityEnum } from 'src/app/shared/common/enums/activity.enums';
import { AppProjectActivityService } from 'src/app/shared/services/app-project-activity.service';
import { AppProjectActivityModel } from 'src/app/shared/model/app-project-activity.model';
import { MdStatusEnum } from 'src/app/shared/common/enums/MdStatus.enums';
import { AppDocumentUploadDetailHistoryService } from 'src/app/shared/services/app-Document-Uploaded.Details.History';
@Component({
  selector: 'app-mou-details',
  templateUrl: './mou-details.component.html',
  styleUrls: ['./mou-details.component.css']
})
export class MouDetailsComponent implements OnInit {
  @Input() MOUdata: any;
  @ViewChild('content') popupview !: ElementRef;
  requestId: string;
  base64textString: any
  datacontent: any
  pdfSrc: any
  modifieddate: any
  fileSizeValidation: any
  filename: any
  fileToUpload: any;
  multiSelect: MultiSelectDropdown[] = [];
  id: any;
  fileextension: string = "";
  documentDetails: Documents[] = [];
  documentType: any;
  zmstProject: any;
  submitted: boolean = false;
  documentCycles: FormGroup;
  dropdownList = [];
  dropdownSettings: IDropdownSettings = {};
  public rowdataMou: any[] = [];
  public rowdataMouSign: any[] = [];
  selectedFile: any = "";
  isavailMouunsign: number = 0;
  isavailMousign: number = 0;
  selectedFilePath: any = "";
  selectedFileB64: any = "";
  myDate = new Date();
  formattedDt:string;
  cyclehide: boolean = false;
  fileUploadValidation: boolean = false;
  userRole: string;
  commonRecords: any = [];
  appDocFilter: AppDocFilter;
  unsinMou: any = 0;
  verified: boolean = false;
  getStatusModel: AppDocFilter;
  projectActivityStatus: AppProjectActivityModel;
  signMou: any = 0;
  appProjectActivityModel: AppProjectActivityModel;
  approved: boolean = false;
  selecteFile:any;
  fileExtension:any;
  fileName:any;
  constructor(
    private modalService: NgbModal,
    private zmstProjectService: ZmstProjectServices,
    private documentTypeService: DocumentTypeService,
    private docUploadService: AppDocumentUploadDetailService,
    private toastrService: ToastrService,
    private datePipe: DatePipe,
    private loader: AfterLoginComponent,
    private confirmationDialogService: ConfirmationDialogService,
    private storage: TokenLocalStorageService,
    private formBuilder: FormBuilder,
    private appProjectActivityService: AppProjectActivityService,
    private appDocumentUploadDetailHistoryService: AppDocumentUploadDetailHistoryService,
  ) {
      this.documentCycles = this.formBuilder.group({
      Uploadfile: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    //this.userRole = this.storage.get('Role');
    this.userRole = this.storage.get('RoleType');
    this.getDocumentData();
    //this.documentData();
  }

  get projectDocumentFormControl() {
    return this.documentCycles.controls;
  }

  onSelectDocumentType(event: any) {
    this.id = event.target.value;
    if (this.id != "03" && this.id != "09" && this.id != "05" && this.id != "02") {
      this.cyclehide = false;
      this.documentCycles.controls['cycle'].setValidators([Validators.required]);
      this.documentCycles.controls['cycle'].updateValueAndValidity();
    }
    else {

      this.cyclehide = true;
      this.documentCycles.controls['cycle'].clearValidators();
      this.documentCycles.controls['cycle'].updateValueAndValidity();
    }
  }

  onItemSelect(item: any) {
    this.multiSelect = [...this.multiSelect, item];
  }

  onSelectAll(item: any) {
    this.multiSelect = item;
  }

  onItemDeSelect(item: any) {
    this.multiSelect = this.multiSelect.filter((user) => user.projectId !== item.projectId);
  }

  onUnSelectAll() {
    this.multiSelect = null;
  }

  documentSubmit() {
    this.submitted = true;
    if (this.fileSizeValidation > 5) {
      this.toastrService.error("file should be smaller than 5 MB")
      return
    }
    if (this.documentCycles.valid && this.fileUploadValidation == false) {
      
      this.confirmationDialogService.confirmPopUp("Do you really want to Submit ?")
        .then(confirmed => {
          if (confirmed == true) {
            {
              
              this.loader.isLoading = true;
              this.documentDetails[0] = {
                requestNo: this.MOUdata.requestNo,
                documentId: 0,
                activityid: ActivityEnum.MOU,
                moduleRefId: this.MOUdata.requestNo,
                docType: "03",
                docId: '',
                docSubject: '',
                docContent: this.base64textString,
                docFileName: this.fileName,
                docContentType: this.fileExtension,
                objectId: '',
                objectUrl: '',
                docNatureId: '',
                ipAddress: '',
                subTime: this.datePipe.transform(this.myDate, 'yyyy-MM-dd'),
                createdBy: this.storage.get('userID'),
              }

              if (this.isavailMouunsign != 0) {

                this.loader.isLoading = false;
                this.appDocumentUploadDetailHistoryService.save(this.documentDetails[0]).subscribe((data: any) => {
                  this.saveDocument();
                  this.getDocumentData();
                  //this.toastrService.success(data);
                })
              }
              else {
                this.saveDocument()
              }

            }
          }
        }
        )
    }
  }

  
  saveDocument() {
    this.docUploadService.save(this.documentDetails).subscribe((data: any) => {
      const message = data;
      this.getDocumentData();
      this.loader.isLoading = false;
      this.documentDetails = [];
      this.toastrService.success(message);
    })
  }

  cleardocumentCycles() {
    this.documentCycles.reset();
    for (let control in this.documentCycles.controls) {
      this.documentCycles.controls[control].setErrors(null);
    }
  }

  viewDocument(data: any) {

    this.loader.isLoading = true;
    this.docUploadService.getById(data).subscribe((res: any) => {
      this.selectedFileB64 = res.docContent;
      this.loader.isLoading = false;
      this.modalService.open(this.popupview, { size: 'xl' });
    })
  }

  btndownload(data: any) {
    this.docUploadService.getById(data).subscribe((res: any) => {
      const linkSource = 'data:application/pdf;base64,' + res.docContent;
      const downloadLink = document.createElement('a');
      const fileName = 'MOU.pdf';
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    })
  }
  getDocumentData() {
    this.appDocFilter = {
      moduleRefId: this.MOUdata.requestNo,
      docType: "",
      activityId: ActivityEnum.MOU
    }
    this.documentTypeService.getByRequestId(this.appDocFilter).subscribe((data: any) => {

      this.getstatus();
      this.rowdataMou = data;
      this.isavailMousign = this.rowdataMou.filter(x => x.docType == "04").length;
      this.isavailMouunsign = this.rowdataMou.filter(x => x.docType == "03").length;

      this.unsinMou = (this.isavailMouunsign == 0) ? null : this.rowdataMou.filter(x => x.docType == "03")[0].documentId;
      this.signMou = (this.isavailMousign == 0) ? null : this.rowdataMou.filter(x => x.docType == "04")[0].documentId;
    })
    this.dropdownSettings = {
      idField: 'projectId',
      textField: 'projectName',
      enableCheckAll: true,
      noDataAvailablePlaceholderText: "There is no item availabale to show"
    };
  }

  handleFileInput(event: any) {
    this.selecteFile = event.target.files[0] ;
    const fileNameWithExtension: string = this.selecteFile.name;
    const [fileName, fileExtension] = fileNameWithExtension.split('.');
    this.fileName=fileNameWithExtension;
    this.fileExtension=fileExtension;
    this.fileToUpload = event.target.files[0];
    this.filename = event.target.files[0].name;
    this.fileextension = event.target.files[0].type;
    var size = event.target.files[0].size;
    this.fileSizeValidation = size / (1024 * 1024);
    if (size / (1024 * 1024) > 5) {
      //this.fileSizeValidation=size/1024;
      return
    }
    this.modifieddate = event.target.files[0].lastModified;
    if (this.fileextension != 'application/pdf') {
      this.fileUploadValidation = true;
      this.toastrService.error('Please Upload Pdf File only');
    } else {
      this.fileUploadValidation = false;
      let $img: any = document.querySelector('#Uploadfile');
      var reader = new FileReader();
      var readerbuffer = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      readerbuffer.onload = this._handleReaderLoaded2.bind(this);

      reader.readAsBinaryString(event.target.files[0]);
      readerbuffer.readAsArrayBuffer($img.files[0]);
    }
  }
  _handleReaderLoaded2(readerEvt: any) {
    let $img: any = document.querySelector('#Uploadfile');
    this.pdfSrc = readerEvt.target.result;
  }
  _handleReaderLoaded(readerEvt: any) {

    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    this.datacontent = this.base64textString;
    return false;

  } get registerFormControl() {
    return this.documentCycles.controls;
  }
  // documentData() {
  //   
  //   this.documentTypeService.getbyRoleId(this.userRole).subscribe((data: any) => {
  //     this.documentType = data;
  //     this.zmstProjectService.GetbyId(this.MOUdata.id).subscribe((data: any) => {
  //       this.zmstProject = data;
  //     })
  //   })
  // }
  getstatus() {

    this.getStatusModel = {
      moduleRefId: this.MOUdata.requestNo,
      docType: "",
      activityId: ActivityEnum.MOU
    }
    this.appProjectActivityService.getById(this.getStatusModel).subscribe((data: any) => {

      if (data.status == MdStatusEnum.Completed) {
        this.approved = true;
      }
    })
  }
  verifiedMou() {
    this.confirmationDialogService.confirmPopUp("Do you really want to Verify this document?")
      .then(confirmed => {
        if (confirmed == true) {
          {
            this.appProjectActivityModel = {
              id: 0,
              activityParentRefId: this.MOUdata.requestNo,
              activityId: Number(ActivityEnum.MOU),
              status: MdStatusEnum.Completed,
              submitTime: "2023-10-19T12:53:17.277Z",
              ipAddress: "",
            }
            this.appProjectActivityService.update(this.appProjectActivityModel).subscribe((data: any) => {
              if (data > 0) {
                this.getstatus();
                this.toastrService.success("Document Verified")
                this.verified = true;

              }
            })
          }
        }
      })
  }
}
