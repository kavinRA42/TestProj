import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
import { error } from 'console';

@Component({
  selector: 'app-form-component',
  templateUrl: './form-component.component.html',
  styleUrls: ['./form-component.component.css']
})
export class FormComponentComponent implements OnInit {

  public settings = {};
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: IDropdownSettings = {};
  name: string='';
  email: string='';
  ntId: string='';
  deviceId: string='';
  manager: string='';

  @Output() popupClose = new EventEmitter<boolean>();

  constructor(private http: HttpClient) { }

  flag: Boolean = true;

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
    this.selectedItems = [];
    this.settings = {
      singleSelection: false,
      idField: 'item_text',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    const userTableComponent = document.querySelector('#bgScreen');
    const userTableComponent1 = document.querySelector('#bgScreen1');
    if (userTableComponent && userTableComponent1) {
      userTableComponent.classList.add('blur');
      userTableComponent1.classList.add('blur');
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

    toast.openToast('User Successfully added!');
  }

  openToastError(type: ToastTypeEnum | string) {
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

    toast.openToast('NT-ID already used!!!');
  }

  closeForm() {
    const userTableComponent = document.querySelector('#bgScreen');
    const userTableComponent1 = document.querySelector('#bgScreen1');
    if (userTableComponent && userTableComponent1) {
      userTableComponent.classList.remove('blur');
      userTableComponent1.classList.remove('blur');
    }
    const formComponent = document.querySelector('app-form-component');
    if (formComponent) {
      formComponent.classList.add('hidden');
    }

    this.popupClose.emit(false);
  }

  data = new FormGroup({
    name: new FormControl('', [Validators.maxLength(50), Validators.required]),
    ntId: new FormControl('', [Validators.maxLength(50), Validators.minLength(5), Validators.required]),
    deviceId: new FormControl(this.selectedItems, [Validators.maxLength(50)]),
    email: new FormControl('', [Validators.email, Validators.required]),
    manager: new FormControl('', Validators.maxLength(50)),
  });

  get emailv() {
    return this.data.get('email');
  }

  get ntId1() {
    return this.data.get('ntId');
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item.item_text);
  }

  onSelectAll(items: any) {
    this.selectedItems = items.map((item: any
    ) => item.item_text);
  }

  onSubmit() {
    const itemList = this.selectedItems.map((item: { item_text: string }) => item.item_text);

    const bodyData = {
      name: this.data.get('name')?.value,
      ntId: this.data.get('ntId')?.value,
      deviceId: this.selectedItems,
      email: this.data.get('email')?.value,
      manager: this.data.get('manager')?.value,
    };

    this.http.post("http://localhost:8081/add", bodyData, { responseType: 'text' })
      .subscribe((resultData: any) => {
        console.log(resultData);
        this.name = '';
        this.ntId = '';
        this.deviceId = this.selectedItems;
        this.email = '';
        this.manager = '';

        this.closeForm();
        this.openToast('success');
        window.location.reload();
      },
      error=> {
        this.openToastError('danger');
      }
    );
  }

  dropdownHandler() {
    this.flag = !this.flag;
    const dropdown = document.querySelector('.dropdown');
    const openIcon = document.querySelector('.open1');
    const closeIcon = document.querySelector('.close1');

    if (dropdown && openIcon && closeIcon) {
      if (this.flag) {
        dropdown.classList.add('hidden');
        openIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
      } else {
        dropdown.classList.remove('hidden');
        openIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
      }
    }
  }
}
