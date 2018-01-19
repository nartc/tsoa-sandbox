import {NgModule} from '@angular/core';

import {ProgressBarModule} from 'primeng/components/progressbar/progressbar';
import {ProgressSpinnerModule} from 'primeng/components/progressspinner/progressspinner';
import {SharedModule} from 'primeng/components/common/shared';
import {SidebarModule} from 'primeng/components/sidebar/sidebar';
import {PanelModule} from 'primeng/components/panel/panel';
import {ButtonModule} from 'primeng/components/button/button';
import {InputTextModule} from 'primeng/components/inputtext/inputtext';
import {CheckboxModule} from 'primeng/components/checkbox/checkbox';
import {GrowlModule} from 'primeng/components/growl/growl';
import {TabViewModule} from 'primeng/components/tabview/tabview';
import {ChartModule} from 'primeng/components/chart/chart';
import {PanelMenuModule} from 'primeng/components/panelmenu/panelmenu';
import {TableModule} from 'primeng/components/table/table';
import {InputSwitchModule} from 'primeng/components/inputswitch/inputswitch';

@NgModule({
  imports: [
    ProgressBarModule,
    ProgressSpinnerModule,
    SharedModule,
    SidebarModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    GrowlModule,
    TabViewModule,
    ChartModule,
    PanelMenuModule,
    TableModule,
    InputSwitchModule
  ],
  exports: [
    ProgressBarModule,
    ProgressSpinnerModule,
    SharedModule,
    SidebarModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    GrowlModule,
    TabViewModule,
    ChartModule,
    PanelMenuModule,
    TableModule,
    InputSwitchModule
  ]
})

export class PrimeNgImportsModule {
}
