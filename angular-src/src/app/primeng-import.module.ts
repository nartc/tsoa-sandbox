import {NgModule} from '@angular/core';

import {ProgressBarModule} from 'primeng/components/progressbar/progressbar';
import {DataTableModule} from 'primeng/components/datatable/datatable';
import {ProgressSpinnerModule} from 'primeng/components/progressspinner/progressspinner';
import {SharedModule} from 'primeng/components/common/shared';
import {SidebarModule} from 'primeng/components/sidebar/sidebar';
import {PanelModule} from 'primeng/components/panel/panel';
import {ButtonModule} from 'primeng/components/button/button';
import {InputTextModule} from 'primeng/components/inputtext/inputtext';
import {CheckboxModule} from 'primeng/components/checkbox/checkbox';
import {GrowlModule} from 'primeng/components/growl/growl';

@NgModule({
  imports: [
    ProgressBarModule,
    DataTableModule,
    ProgressSpinnerModule,
    SharedModule,
    SidebarModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    GrowlModule
  ],
  exports: [
    ProgressBarModule,
    DataTableModule,
    ProgressSpinnerModule,
    SharedModule,
    SidebarModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    GrowlModule
  ]
})

export class PrimeNgImportsModule {
}
