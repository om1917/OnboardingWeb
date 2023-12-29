import { Component, OnInit } from '@angular/core';
import { AppOnBoardingRequestService } from '../../services/appOnBoardingRequest';
import { TokenLocalStorageService } from '../../tokenLocalStorage/tokenLocalStorageService';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AfterLoginComponent } from '../../../shared/after-login/after-login.component';
import { DatePipe } from '@angular/common';
import { EncyptionDecryption } from '../../common/EncyptionDecryption';
import { AppDocumentUploadDetailService } from '../../services/appDocumentUploadedDetailService';
import { ConfigurationApiSecureKey } from '../../services/ConfigurationApiSecureKey.Services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  Name: string;
  Designation: string;
  userName: any;
  token: any;
  imgsrc: any;
  selectedFileB64: string;
  requestNo: string;
  encSecretKey: string;
  encsalt: string;
  encryptedRequestNo: string;
  constructor(private documentUploadDetailService: AppDocumentUploadDetailService,
    private router: Router, private storage: TokenLocalStorageService,
    private toastrService: ToastrService,
    private tokenService: TokenLocalStorageService,
    private users: AppOnBoardingRequestService,
    private sanitizer: DomSanitizer,
    private loader: AfterLoginComponent,
    private configurationApiSecureKey: ConfigurationApiSecureKey,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getEncryptionKey();
    this.userName = this.storage.get('userID');
    this.token = this.storage.get('token');
    this.loader.isLoading = true;
    this.users.getUserProfile(this.userName).subscribe((data: any) => {
      this.Name = data[0].username;
      this.Designation = data[0].userrole;
      if (data[0].docContent.trim() != "") {
        this.selectedFileB64 = data[0].docContent;
        this.imgsrc = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.selectedFileB64}`);
      }
      else {
        this.imgsrc = "assets/images/avatars/avatar-1.png";
      }
      this.loader.isLoading = false;
    });
    this.onEventChanges();
  }

  onLogoutClick() {
    const logout = {
      userId: this.storage.get('userID'),
      refreshToken: this.storage.get('refreshToken'),
      token: this.storage.get('token')
    }
    this.users.logout(logout).subscribe((res: any) => {
      this.toastrService.success(res);
      localStorage.removeItem('token');
      this.tokenService.removeData('requestNo');
      this.tokenService.removeData('userRoleID');
      localStorage.clear();
      this.router.navigate(['/login']);
    })
  }
  cngPssClick() {
    this.router.navigate(['auth/changePassword']);
  }
  userprofile() {
    let number = this.getRandomNumber();
    if (atob(localStorage.getItem('Role')) == 'ADMIN') {
      this.encryptedRequestNo = EncyptionDecryption.Encrypt(number, this.encSecretKey, this.encsalt);
      this.router.navigate(['auth/UserProfile/' + this.encryptedRequestNo]);
    }
    else if (atob(localStorage.getItem('Role')) == 'USER') {
      this.requestNo = this.storage.get('requestNo');
      this.encryptedRequestNo = EncyptionDecryption.Encrypt(this.requestNo + number, this.encSecretKey, this.encsalt);
      this.router.navigate(['auth/UserProfile/' + this.encryptedRequestNo]);
    }
    else {
      this.requestNo = this.storage.get('requestNo');
      this.encryptedRequestNo = EncyptionDecryption.Encrypt(this.requestNo + number, this.encSecretKey, this.encsalt);
      this.router.navigate(['auth/UserProfile/' + this.encryptedRequestNo]);
    }
  }

  getRandomNumber() {
    const today = new Date();
    let date = this.datePipe.transform(today, 'YYMMddHHMMSSSSS');
    return date;
  }

  onEventChanges() {
    this.documentUploadDetailService.getRefreshProfileHeader().subscribe((data: any) => {
      this.userName = this.storage.get('userID');
      this.token = this.storage.get('token');
      this.loader.isLoading = true;
      this.users.getUserProfile(this.userName).subscribe((data: any) => {
        this.Name = data[0].username;
        this.Designation = data[0].userrole;
        if (data[0].docContent.trim() != "") {
          this.selectedFileB64 = data[0].docContent;
          this.imgsrc = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.selectedFileB64}`);
        }
        else {
          this.imgsrc = "assets/images/avatars/avatar-1.png";
        }
        this.loader.isLoading = false;
      })
    });
  }
  getEncryptionKey() {
    this.configurationApiSecureKey.getAllKey().subscribe((data: any) => {
      this.encSecretKey = data[0].secretKey
      this.encsalt = data[0].salt
    })
  }
}
