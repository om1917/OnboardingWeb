
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenLocalStorageService } from 'src/app/shared/tokenLocalStorage/tokenLocalStorageService';
import { Documents } from 'src/app/shared/model/documentsModel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AfterLoginComponent } from 'src/app/shared/after-login/after-login.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AppDocumentUploadDetailService } from 'src/app/shared/services/appDocumentUploadedDetailService';
import { DocumentTypeService } from 'src/app/shared/services/documentTypeService';
import { ZmstProjectServices } from 'src/app/shared/services/ZmstProjectServices';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppDocFilter } from 'src/app/shared/model/appDocFilterModel';
import { ActivityEnum } from 'src/app/shared/common/enums/activity.enums';
import { AppProjectActivityService } from 'src/app/shared/services/app-project-activity.service';
import { EncyptionDecryption } from 'src/app/shared/common/EncyptionDecryption';
import { AppProjectActivityModel } from 'src/app/shared/model/app-project-activity.model';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationApiSecureKey } from 'src/app/shared/services/ConfigurationApiSecureKey.Services';
@Component({
  selector: 'app-proposal-invoice',
  templateUrl: './proposal-invoice.component.html',
  styleUrls: ['./proposal-invoice.component.css']
})
export class ProposalInvoiceComponent implements OnInit {
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
  isavail: number = 0;
  Proposal: number = 0;
  CoverLetter: number = 0;
  selectedFilePath: any = "";
  selectedFileB64: any = "";
  userRole: string;
  appDocFilter: AppDocFilter;
  unsinMou: any = 0;
  signMou: any = 0;
  decSecretKey: string;
  decsalt: string;
  pi: any;
  appProjectActivityModel: AppProjectActivityModel;
  constructor(
    private documentTypeService: DocumentTypeService,
    private route: ActivatedRoute,
    private docUploadService: AppDocumentUploadDetailService,
    private loader: AfterLoginComponent,
    private configurationApiSecureKey: ConfigurationApiSecureKey,
    private storage: TokenLocalStorageService,
    private formBuilder: FormBuilder) {
    this.documentCycles = this.formBuilder.group({
      Uploadfile: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    // this.getDecryptionKey();

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
      const fileName = 'proposalInvoice.pdf';
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
      activityId:ActivityEnum.ProposalAndPI
    }
    this.documentTypeService.usergetByRequestId(this.appDocFilter).subscribe((data: any) => {

      this.rowdataMou = data;
      this.pi = data[0].documentId;
      this.Proposal = data[1].documentId;
      this.CoverLetter = data[2].documentId;
      this.isavail = this.rowdataMou.filter(x => x.docType == "05").length;
      this.loader.isLoading = false;
    })
  }
}
