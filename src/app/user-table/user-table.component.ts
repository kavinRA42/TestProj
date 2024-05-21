import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { DataService } from './data.service'
import { NgxSpinnerService } from "ngx-spinner";
import { ToastifyRemoteControl } from '@ng-vibe/toastify';
import {
  AppearanceAnimation,
DisappearanceAnimation,
ProgressBar,
TextAlignEnum,
ToastifyService,
ToastPosition,
ToastTypeEnum,
} from '@ng-vibe/toastify';
import { NgConfirmService } from 'ng-confirm-box';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements OnInit {

  deletionRow:any;
  hover: boolean = false;
  file!: string | Blob;

  constructor(private formService:DataService,private confirmService: NgConfirmService ,private router:Router, private http:HttpClient, private spinner:NgxSpinnerService, private toast:ToastifyRemoteControl) { }

  

  ngOnInit(): void {
    this.loadForms();
    // this.spinner.show();
    // setTimeout(() => {
    //   this.spinner.hide();
    // }, 5000);
  }

  

  searchBool:boolean = false;
  pageKeep:number =0;
  forms:any;
  pageNumber: number = 0;
  pageSize: number = 10;
  columnMode = ColumnMode;
  totall: number = 0;
  sort: string = 'name';
  direction: string = 'asc'; 
  data: any = {};
  boolSort: Boolean = false;
  rowColors : Boolean = true;

  ClientArray: any[]=[];
  columns: any[] = [];
  addUserPopup : boolean = false;
  addUpdatePopup : boolean = false;
  addAlert : boolean = false;

  loadForms() {
    
  this.formService.getForms(this.pageNumber, this.pageSize)
    .subscribe((forms: any) => {
      this.forms = forms.content.map((form: any) => {

        const timeFormattedDate = new Date(form.timeFormatted);

        const formattedTime = `${timeFormattedDate.getDate()}-${timeFormattedDate.getMonth() + 1}-${timeFormattedDate.getFullYear()} / ${timeFormattedDate.getHours()}:${timeFormattedDate.getMinutes()}`;

        return { ...form, timeFormatted: formattedTime };
      });
      this.totall = forms.totalElements;
      this.pageKeep = this.pageNumber;
      this.pageNumber = 0;

    });
}

  onPageChange(event: any): void {
    this.pageNumber = event.offset;
    if(this.boolSort){
      this.fetchData();
    }
    else{
      this.loadForms();
    }

  }

  onSort(event: any): void {
    this.sort = event.sorts[0].prop;
    this.direction = event.sorts[0].dir;
    if(this.searchBool){
      this.fetchData();
    }
    else{
      this.loadForms();
    }  
  }

  fetchData(): void {
    this.formService.fetchData(this.pageNumber, this.pageSize, this.sort, this.direction)
      .subscribe((forms: any) => {
        this.forms = forms.content.map((form: any) => {

          const timeFormattedDate = new Date(form.timeFormatted);
          console.log(timeFormattedDate);
          const formattedTime = `${timeFormattedDate.getDate()}-${timeFormattedDate.getMonth() + 1}-${timeFormattedDate.getFullYear()} / ${timeFormattedDate.getHours()}:${timeFormattedDate.getMinutes()}`;
          console.log(formattedTime);
          return { ...form, timeFormatted: formattedTime };
        });
        this.boolSort = true;
        // this.forms = forms.content;
        this.totall = forms.totalElements;
        this.pageKeep=this.pageNumber;
        this.pageNumber=0;
        console.log("-----------------------");
        console.log(this.forms);
      });
  }

  onSearch(filter: string){

    this.pageKeep=0;
    this.searchBool = true;
    this.formService.searchForms(this.pageNumber, this.pageSize, filter)
    .subscribe((forms:any) => {this.forms = forms.content;
      this.forms = forms.content.map((form: any) => {

        const timeFormattedDate = new Date(form.timeFormatted);
        console.log(timeFormattedDate);
        const formattedTime = `${timeFormattedDate.getDate()}-${timeFormattedDate.getMonth() + 1}-${timeFormattedDate.getFullYear()} / ${timeFormattedDate.getHours()}:${timeFormattedDate.getMinutes()}`;
        console.log(formattedTime);
        return { ...form, timeFormatted: formattedTime };
      });
      this.totall = forms.totalElements;
      
    });
  }

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
  }
  
  
  colDefs: any[] = [
    { prop: "name", name: "Name" },
    { prop: "ntId", name: "Nt Id" },
    // { prop: "deviceId", name: "Device Id" },
    { prop: "email", name: "Email" },
    { prop: "manager", name: "Manager" },
    { prop: "timeFormatted", name: "Time" }
  ];

  checker(event: any){
    console.log(event);
  }

  openForm() {
    this.addUserPopup = true;
  }

  addUserPopupClose(event:Boolean){
    this.addUserPopup = false;
  }

  addUpdatePopupClose(event: Boolean){
    this.addUpdatePopup = false;
  }

  addAlertBox(event: boolean){
    this.addAlert = event;
    this.deletion()

  }

  editRow(row: any){
    this.addUpdatePopup = true;
    this.formService.searchForms(this.pageNumber, this.pageSize, row)
      .subscribe((forms: any) => {
        const form = forms.content[0];
        this.formService.setFormData(form);

      });


  }

  onGetRowClass= (boo: { manager: string; }) => {
    if(this.rowColors && boo.manager.length!=0 == true){
      this.rowColors=false;
      return "blueRow";
    } else {
      this.rowColors=true;
      return "whiteRow";
    }
      
    
  } 


  deleteRow(row: any){
    const AlertBoxComponent = document.querySelector('#test');
    
    if (AlertBoxComponent) {
      AlertBoxComponent.classList.remove('hidden');
      this.deletionRow=row
    }
    
  }
  deletion(){
    if(this.addAlert == true){
      this.http.delete("http://localhost:8081/delete"+"/"+this.deletionRow,{responseType:'text'})
        .subscribe((resultData:any)=>{
        this.loadForms();
        this.openToast('danger');
        console.log('check..?');
    });
    } else {
      console.log("For no button");
    }
  }

  public service: ToastifyService = inject(ToastifyService);

  openToast(type: ToastTypeEnum | string) {
    
    const toast = new ToastifyRemoteControl();
    toast.options = {
      autoCloseDuration: 3000,
      layoutType: type as ToastTypeEnum,
      position: ToastPosition.TOP_RIGHT,
      progressBar: ProgressBar.DECREASE,
      textAlign: TextAlignEnum.START,
      animationIn: AppearanceAnimation.FADE_IN,
      animationOut: DisappearanceAnimation.ZOOM_OUT
    };
    
    toast.openToast('User Successfully Deleted!');
  }


  sendFile() {
    const formData = new FormData();
    formData.append('file', this.file);
    this.http.post("http://localhost:8081/upload", formData,{responseType: 'text'})
    .subscribe((resultData:any)=>{
      console.log(resultData);
      window.location.reload();
      });
    
  }





}
