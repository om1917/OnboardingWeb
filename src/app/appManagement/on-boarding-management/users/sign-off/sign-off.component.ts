import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenLocalStorageService } from 'src/app/shared/tokenLocalStorage/tokenLocalStorageService';
import { Documents } from 'src/app/shared/model/documentsModel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AfterLoginComponent } from 'src/app/shared/after-login/after-login.component';
import { AppDocumentUploadDetailService } from 'src/app/shared/services/appDocumentUploadedDetailService';
import { DocumentTypeService } from 'src/app/shared/services/documentTypeService';
import { AppDocFilter } from 'src/app/shared/model/appDocFilterModel';
import { EncyptionDecryption } from 'src/app/shared/common/EncyptionDecryption';
import { AppProjectActivityModel } from 'src/app/shared/model/app-project-activity.model';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from 'src/app/shared/services/confirmation-dialog.service';
import { ActivityEnum } from 'src/app/shared/common/enums/activity.enums';
import { DocTypeEnum } from 'src/app/shared/common/enums/docType.enums';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppProjectActivityService } from 'src/app/shared/services/app-project-activity.service';
import { MdStatusEnum } from 'src/app/shared/common/enums/MdStatus.enums';
import { ConfigurationApiSecureKey } from 'src/app/shared/services/ConfigurationApiSecureKey.Services';
import { AppOnBoardingRequestService } from 'src/app/shared/services/appOnBoardingRequest';

@Component({
  selector: 'app-sign-off',
  templateUrl: './sign-off.component.html',
  styleUrls: ['./sign-off.component.css'],
})
export class SignOffComponent implements OnInit {
  @ViewChild('content') popupview!: ElementRef;
  requestId: string;
  base64textString: any;
  datacontent: any;
  pdfSrc: any;
  modifieddate: any;
  fileSizeValidation: any;
  filename: any;
  fileToUpload: any;
  id: any;
  fileextension: string = '';
  documentDetails: Documents[] = [];
  documentType: any;
  zmstProject: any;
  submitted: boolean = false;
  approved: boolean = false;
  signOffFormGroup: FormGroup;
  dropdownList = [];
  dropdownSettings: IDropdownSettings = {};
  public rowdataMou: any[] = [];
  public rowdataMouSign: any[] = [];
  selectedFile: any = '';
  isavail: number = 0;
  selectedFilePath: any = '';
  selectedFileB64: any = '';
  userRole: string;
  appDocFilter: AppDocFilter;
  appProjectActivityModel: AppProjectActivityModel;
  fileUploadValidation: boolean = false;
  myDate = new Date();
  signOffDocId: any = 0;
  decSecretKey: string;
  decsalt: string;
  isAvailableSignOff: number = 0;
  selecteFile:any;
  fileExtension:any;
  fileName:any;
  ipAddress = '_._._._';
  constructor(
    private documentTypeService: DocumentTypeService,
    private route: ActivatedRoute,
    private docUploadService: AppDocumentUploadDetailService,
    private loader: AfterLoginComponent,
    private storage: TokenLocalStorageService,
    private formBuilder: FormBuilder,
    private configurationApiSecureKey: ConfigurationApiSecureKey,
    private toastrService: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    private datePipe: DatePipe,
    private appProjectActivityService: AppProjectActivityService,
    private modalService: NgbModal,
    private user: AppOnBoardingRequestService,
  ) {
    this.signOffFormGroup = this.formBuilder.group({
      Uploadfile: [''],
    });
  }

  ngOnInit(): void {
    //this.getDecryptionKey();
    this.configurationApiSecureKey.getAllKey().subscribe((data: any) => {
      
      this.decSecretKey = data[0].secretKey
      this.decsalt = data[0].salt
   
    this.requestId = this.route.snapshot.params['id'].toString();
    this.requestId = EncyptionDecryption.Decrypt(this.requestId,this.decSecretKey,this.decsalt);
    this.requestId = this.requestId.substring(0, this.requestId.length - 15);
    this.loader.isLoading = false;
    this.userRole = this.storage.get('RoleType');
    this.getDocumentData();
  })
  }

  btndownload(data: any) {

    this.docUploadService.getById(data).subscribe((res: any) => {
      const linkSource = 'data:application/pdf;base64,' + res.docContent;
      const downloadLink = document.createElement('a');
      const fileName = 'SignOff.pdf';
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    })
  }
  getDecryptionKey() {
    this.configurationApiSecureKey.getAllKey().subscribe((data: any) => {
      
      this.decSecretKey = data[0].secretKey
      this.decsalt = data[0].salt
    })
  }
  getDocumentData() {
    this.appDocFilter = {
      moduleRefId: this.requestId,
      docType: "",
      activityId: ActivityEnum.UC
    }
    this.documentTypeService.getByRequestId(this.appDocFilter).subscribe((data: any) => {
      this.getstatus();
      this.rowdataMou = data;
      this.isAvailableSignOff = this.rowdataMou.filter(x => x.docType == "40").length;
      this.signOffDocId = (this.isAvailableSignOff == 0) ? null : this.rowdataMou.filter(x => x.docType == DocTypeEnum.SignOffAndDataHandover.toString())[0].documentId;
      this.loader.isLoading = false;
    })
    this.dropdownSettings = {
      idField: 'projectId',
      textField: 'projectName',
      enableCheckAll: true,
      noDataAvailablePlaceholderText: "There is no item availabale to show"
    };
  }
  get signOffFormControl() {
    return this.signOffFormGroup.controls;
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
    this.fileSizeValidation = size / 1024;
    if (size / 1024 > 500) {
      this.fileSizeValidation = size / 1024;
      return;
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
  }
  btnSubmit() {
    this.submitted = true;

    if (this.signOffFormGroup.valid && this.fileUploadValidation == false) {
      this.confirmationDialogService.confirmPopUp("Do you really want to Submit ?")
        .then(confirmed => {
          if (confirmed == true) {
            {
              this.loader.isLoading = true;
              if (1 == 1) {
                this.documentDetails[0] = {
                  requestNo: this.requestId,
                  documentId: 0,
                  activityid: ActivityEnum.SignOffAndDataHandover,
                  moduleRefId: this.requestId,
                  docType: DocTypeEnum.SignOffAndDataHandover.toString(),
                  docId: '',
                  docSubject: '',
                  docContent: this.base64textString,
                  docFileName: this.fileName,
                  docContentType: this.fileExtension,
                  objectId: '',
                  objectUrl: '',
                  docNatureId: '',
                  ipAddress: this.ipAddress,
                  subTime: this.datePipe.transform(this.myDate, 'yyyy-MM-dd'),
                  createdBy: this.storage.get('userID'),
                }
                this.docUploadService.SaveDocumetAndUpdateStatus(this.documentDetails[0]).subscribe({
                  next: (data: any) => {
                    this.loader.isLoading = false;
                  }, error: (err) => {
                    this.loader.isLoading = false;
                  }
                })

              }
            }
          }
        }
        )
    }
  }

  btncancel() {
    this.signOffFormGroup.reset();
    this.submitted = false;
  }

  viewDocument(data: any) {

    this.loader.isLoading = true;
    this.docUploadService.getById(data).subscribe((res: any) => {
      this.selectedFileB64 = res.docContent;
      this.loader.isLoading = false;
      this.modalService.open(this.popupview, { size: 'xl' });
    })
  }
  getIPAddress() {
    this.loader.isLoading = true;
    this.user.GetIP().subscribe((res: any) => {
      this.ipAddress = res;
      this.loader.isLoading = false;
    })
  }
  getstatus() {
    this.appDocFilter = {
      moduleRefId: this.requestId,
      docType: "",
      activityId: ActivityEnum.MOU
    }
    this.appProjectActivityService.getById(this.appDocFilter).subscribe((data: any) => {

      if (data.status == MdStatusEnum.Completed) {
        this.approved = true;
      }
    })
  }
}
