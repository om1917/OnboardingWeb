import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { AfterLoginComponent } from 'src/app/shared/after-login/after-login.component';
import { EncyptionDecryption } from 'src/app/shared/common/EncyptionDecryption';
import { Documents } from 'src/app/shared/model/documentsModel';
import { MultiSelectDropdown } from 'src/app/shared/model/multiSelectDropdownModel';
import { AppDocumentUploadDetailService } from 'src/app/shared/services/appDocumentUploadedDetailService';
import { DocumentTypeService } from 'src/app/shared/services/documentTypeService';
import { ProjectDetailsServices } from 'src/app/shared/services/ProjectDetailsServices';
import { ZmstProjectServices } from 'src/app/shared/services/ZmstProjectServices';
import { TokenLocalStorageService } from 'src/app/shared/tokenLocalStorage/tokenLocalStorageService';
import { ConfirmationDialogService } from 'src/app/shared/services/confirmation-dialog.service';
import { SideBarService } from 'src/app/shared/services/sidebar-services';
import { ActivityEnum } from 'src/app/shared/common/enums/activity.enums';
import { ConfigurationApiSecureKey } from 'src/app/shared/services/ConfigurationApiSecureKey.Services';
import { DatePipe } from '@angular/common';
import { AppOnBoardingRequestService } from 'src/app/shared/services/appOnBoardingRequest';
@Component({
  selector: 'app-user-documents',
  templateUrl: './user-documents.component.html',
  styleUrls: ['./user-documents.component.css'],
})
export class UserDocumentsComponent implements OnInit {
  requestId: string;
  id: any;
  rowData: any;
  filterdoctype: any;
  documentCycles: FormGroup;
  submittedDocument: boolean = false;
  filename: string = '';
  base64textString: string = '';
  modifieddate: string = '';
  fileextension: string = '';
  zmstProject: any;
  documentType: any = [];
  docid: string;
  decSecretKey: string
  decsalt: string
  selectedFileB64: string;
  public rowdata!: any[];
  fileToUpload: File | null = null;
  multiSelect: MultiSelectDropdown[] = [];
  documentDetails: Documents[] = [];
  dropdownSettings: IDropdownSettings = {};
  token: any;
  alreadyUploaddata: any[] = [];
  notuploaddoc: any[] = [];
  datauploadhide: boolean = true;
  gridhide: boolean = false;
  fileUploadValidation: boolean = false;
  menudata: any;
  loadno: number = 0;
  userRole: any;
  Id: Number = 0;
  myDate=new Date();
  selecteFile:any;
  fileExtension:any;
  fileName:any;
  ipAddress = '_._._._';
  constructor(
    private storage: TokenLocalStorageService,
    private sidebarUser: SideBarService,
    private confirmationDialogService: ConfirmationDialogService,
    private usermenu: AppDocumentUploadDetailService,
    private showdocumentsUser: AppDocumentUploadDetailService,
    private projectService: ProjectDetailsServices,
    private zmstProjectService: ZmstProjectServices,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private docUploadService: AppDocumentUploadDetailService,
    private formBuilder: FormBuilder,
    private documentTypeService: DocumentTypeService,
    private modalService: NgbModal,
    private configurationApiSecureKey: ConfigurationApiSecureKey,
    private loader: AfterLoginComponent,
    private datePipe:DatePipe,
    private user: AppOnBoardingRequestService

  ) {
    this.documentCycles = this.formBuilder.group({
      docType: ['', [Validators.required]],
      chooseFile: ['', [Validators.required]],
      subjectName: ['', [Validators.required]],
    });
    route.params.subscribe(() => {
      this.docid = this.route.snapshot.params['docID'].toString();
      if (this.docid == 'NA') {
        this.datauploadhide = false;
        this.gridhide = true;
        this.documentCycles.controls['docType'].enable();
      } else {
        this.datauploadhide = true;
        this.gridhide = false;
        this.documentCycles.controls['docType'].disable();
      }
    });
  }
  @ViewChild('content') popupview!: ElementRef;
  ngOnInit(): void {
    //this.getDecryptionKey();
    this.configurationApiSecureKey.getAllKey().subscribe((data: any) => {

      this.decSecretKey = data[0].secretKey
      this.decsalt = data[0].salt
      this.loader.isLoading = false;
      this.requestId = this.route.snapshot.params['Id'].toString();
      this.docid = this.route.snapshot.params['docID'].toString();
      this.requestId = EncyptionDecryption.Decrypt(this.requestId, this.decSecretKey, this.decsalt);
      this.requestId = this.requestId.substring(0, this.requestId.length - 15);
      this.userRole = this.storage.get('RoleType');
      this.projectDocumentFormControl.docType.setValue(0);
      this.documentTypeService
        .getbyRoleId(this.userRole)
        .subscribe((data: any) => {
          this.documentType = data;
          this.projectService.getbyId(this.requestId).subscribe({
            next: (data: any) => {
              if (data[0] == null) {
                this.rowData = 'NA';
              } else {
                this.rowData = data[0];
                this.filterdoctype = this.rowData;
              }
              // 
              this.zmstProjectService
                .GetbyId(this.requestId)
                .subscribe((data: any) => {
                  this.zmstProject = data;
                });
              this.documentCycles.patchValue({
                docType: this.docid,
              });
              this.docid = this.route.snapshot.params['docID'].toString();
              //this.getDocumentData();
              this.documentCycles.patchValue({
                docType: this.docid,
              });
            },
            error: () => {
              this.rowData.projectYear = 'NA';
              this.rowData.projectName = 'NA';
              this.rowData.projectCode = 'NA';
            },
          });
        });
      this.documentCycles.reset({ docType: '' });
    })
  }
  ngAfterViewInit(): void {
    this.loadno = 4;
    this.docid = this.route.snapshot.params['docID'].toString();
    this.documentCycles.patchValue({
      docType: this.docid,
    });
  }
  getuploadeddata() { }
  onSelectDocumentType(event: any) {
    this.id = event.target.value;
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
      reader.readAsBinaryString(event.target.files[0]);
      readerbuffer.readAsArrayBuffer($img.files[0]);
    }
  }
  _handleReaderLoaded(readerEvt: any) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
    return false;
  }
  get projectDocumentFormControl() {
    return this.documentCycles.controls;
  }

  btndownload(data: any) {
    this.docUploadService.getById(data).subscribe((res: any) => {
      const linkSource = 'data:application/pdf;base64,' + res.docContent;
      const downloadLink = document.createElement('a');
      const fileName = 'UserDocument.pdf';
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    });
  }
  viewDocument(data: any) {

    this.loader.isLoading = true;
    this.docUploadService.getById(data).subscribe((res: any) => {
      this.sidebarUser.refreshData(res);
      this.selectedFileB64 = res.docContent;
      this.loader.isLoading = false;
      this.modalService.open(this.popupview, { size: 'xl' });
    });
  }
  getDecryptionKey() {
    this.configurationApiSecureKey.getAllKey().subscribe((data: any) => {

      this.decSecretKey = data[0].secretKey
      this.decsalt = data[0].salt
    })
  }
  getIPAddress() {
    this.loader.isLoading = true;
    this.user.GetIP().subscribe((res: any) => {
      this.ipAddress = res;
      this.loader.isLoading = false;
    })
  }

  documentSubmit() {
    this.submittedDocument = true;

    if (this.documentCycles.valid && this.fileUploadValidation == false) {
      this.confirmationDialogService
        .confirmPopUp('Do you really want to Submit ?')
        .then((confirmed) => {
          if (confirmed == true) {
            {

              this.documentDetails[0] = {
                docSubject: this.documentCycles.get("subjectName").value, 
                requestNo: this.requestId,
                documentId: 0,
                activityid: ActivityEnum.Onboarding_Request,
                moduleRefId: this.requestId,
                docType: this.id,
                docId: '',
                docContent: this.base64textString,
                docFileName: this.fileName,
                docContentType: this.fileExtension,
                objectId: '',
                objectUrl: '',
                docNatureId: '',
                ipAddress: this.ipAddress,
                subTime:this.datePipe.transform(this.myDate, 'yyyy-MM-dd'),
                createdBy: this.storage.get('userID'),
              };
              this.docUploadService
                .save(this.documentDetails)
                .subscribe((data: any) => {
                  this.loader.isLoading = false;
                  const message = data;
                  this.multiSelect = [];
                  this.documentCycles.patchValue({
                    cycle: '',
                    chooseFile: '',
                  });
                  this.usermenu
                    .getUserMenu(this.requestId)
                    .subscribe((data: any) => {
                      this.menudata = data;
                      this.sidebarUser.refreshData(this.menudata);
                      this.documentDetails = [];

                      this.toastrService.success(message);
                      return false;
                    });
                });
            }
          }
        });
    }
  }
}
