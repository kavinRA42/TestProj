import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../user-table/data.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
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


@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  public settings = {};
  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:IDropdownSettings={};

  constructor(private http: HttpClient, private router: Router, private formService: DataService) { }

  i:number=0;
  dropdown: any;
  open1: any;
  close1: any;
  flag: Boolean = true;

  @Output() updatePopClose = new EventEmitter<boolean>();

  

  ngOnInit(): void {

    this.dropdownList = [
      { item_text: 'K4AA' },
      { item_text: 'J4AA' },
      { item_text: 'MNS5' },
      { item_text: 'Navsari' },
      { item_text: 'NNA8' },
      { item_text: 'AAN9' },
      { item_text: 'MNAK8' },
      { item_text: 'JJK8' },
      { item_text: 'VINN8' },
      { item_text: 'BAJ9' },
      { item_text: 'BOO2' },
      { item_text: 'NABA' },
      { item_text: 'GOO0' },
      { item_text: 'AAZK' },
      { item_text: 'KAKK0' }
    ];
    this.selectedItems = [ ];

    this.settings = {
      singleSelection: false,
      idField: 'item_text',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      limitSelection: -1,
      maxHeight: 197,
    };

    const formComponent = document.querySelector('app-update');
    const userTableComponent = document.querySelector('#bgScreen');
    const userTableComponent1 = document.querySelector('#bgScreen1');
    if (userTableComponent && userTableComponent1) {
        userTableComponent.classList.add('blur');
        userTableComponent1.classList.add('blur');
    }
    if (formComponent) {
        formComponent.classList.remove('hidden');
    }

    this.formService.formData$.subscribe(form => {
      if (form) {
        this.data.get('ntId')?.disable();
        this.data.patchValue({
          name:form.name,
          ntId: form.ntId,
          // deviceId: form.deviceId,
          email: form.email,
          manager: form.manager,
        });
        console.log(this.data.get('deviceId'));
        this.selectedItems = form.deviceId;
        console.log("-----------");
        console.log(this.selectedItems);

      }
    });
  }



  data = new FormGroup({
    name: new FormControl('',[Validators.maxLength(50)]),
    ntId: new FormControl('', [Validators.maxLength(50)]),
    deviceId: new FormControl(this.selectedItems, [Validators.maxLength(50)]),
    email: new FormControl('',Validators.email),
    manager: new FormControl('', Validators.maxLength(50)),
    note: new FormControl('', Validators.maxLength(255))
  });


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
    
    toast.openToast('User updated added!');
  }
  



  onUpdate() {

    const itemList = this.selectedItems.map((test: { hasOwnProperty: (arg0: string) => any; item_text: any; }) => {
      if (typeof test === 'object' && test.hasOwnProperty('item_text')) {
        return test.item_text;
      }
      return test;
    });

    let bodyData = {
      name:this.data.get('name')?.value,
      ntId: this.data.get('ntId')?.value,
      deviceId: itemList,
      email: this.data.get('email')?.value,
      manager: this.data.get('manager')?.value,
      note: this.data.get('note')?.value,
    };
    
    this.http.put("http://localhost:8081/update" + "/" + bodyData.ntId, bodyData, { responseType: 'text' })
      .subscribe((resultData: any) => {

        this.data.reset();
        const formComponent = document.querySelector('app-update');
        const userTableComponent = document.querySelector('#bgScreen');
        const userTableComponent1 = document.querySelector('#bgScreen1');
        if (userTableComponent && userTableComponent1) {
          userTableComponent.classList.remove('blur');
          userTableComponent1.classList.remove('blur');
        }
        if (formComponent) {
          formComponent.classList.add('hidden');
        }

        this.updatePopClose.emit(false);

        window.location.reload();
        this.toastt()

      });

  }
  
  toastt(){
    this.openToast('success');
  }
  

  

  closeForm() {
    console.log(this.data.value);
    const formComponent = document.querySelector('app-update');
    const userTableComponent = document.querySelector('#bgScreen');
    const userTableComponent1 = document.querySelector('#bgScreen1');
    if (userTableComponent && userTableComponent1) {
      userTableComponent.classList.remove('blur');
      userTableComponent1.classList.remove('blur');
    }
    if (formComponent) {
      formComponent.classList.add('hidden');
    }

    console.log(this.selectedItems);

    this.updatePopClose.emit(false);
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item.item_text);
    console.log(item.item_text);
  }
  onSelectAll(items: any) {
    console.log(items.item_text);
    this.selectedItems.push(items);
  }

}
