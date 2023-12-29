import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class ErrorHandlerService implements ErrorHandler{
    constructor(private router: Router)
    {

    }
    
    handleError(error: any): void {
        
        if(error instanceof HttpErrorResponse)
        {
            
            // if(error.status == 404)
            // {
            //     this.router.navigate(['/Unauthorize']);
            // }
            // if(error.error.includes("This request is unauthorized")|| error.status == 401){
                
            //     this.router.navigate(['/Unauthorize']);
            // }
            
           // else if(error.status == 500)
            {
                
                  //  this.router.navigate(['/InternalServerError']);
                  // this.toastrService.error("Testinggggggggg");
                 //alert(error.message);
                }
        };
    }
    
}
