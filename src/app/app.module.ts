//our root app component
import {NgModule} from '@angular/core'
import { FormsModule } from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component'
import { Ng2FileInputModule } from 'ng2-file-input';
import { PapaParseModule } from 'ngx-papaparse';




import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import {DataTableModule, PaginatorModule, DropdownModule, ToggleButtonModule } from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import {DataImportService} from './data-import.service';





@NgModule({
  imports: [ BrowserModule, Ng2FileInputModule.forRoot(),
             PapaParseModule, DataTableModule, TableModule, 
             PaginatorModule, FormsModule, DropdownModule, ToggleButtonModule,
             BrowserAnimationsModule, 
             HttpClientModule,
             HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: false }), //should it be true?******


             ],

  declarations: [ AppComponent ],
  providers: [ DataImportService],
  bootstrap: [ AppComponent ]

})
export class AppModule {}