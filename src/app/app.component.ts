import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChild,  ChangeDetectorRef   } from '@angular/core';
import { Ng2FileInputService, Ng2FileInputAction } from 'ng2-file-input';
import { PapaParseService } from 'ngx-papaparse';
import { SelectItem, Dropdown, Column, Row, Dialog } from 'primeng/primeng';
import { QueryList } from '@angular/core';
import { DataImportService } from './data-import.service';
import { Table } from 'primeng/table';





export class FieldDef {
  field: string;
  header: string;
}

export class MapField  {
  field: string;
  header: string;
}

export class MapOption {
  label: string;
  value: string;
}

export class ImportType {
  label: string;
  value: number;
}

export class ErrorType {
  row: number;
  column: number;
  description: string;
}


export class FieldMapItem {
  ColumnIndex: number;
  MapId: number;
}


export class FieldItem {
  PK: number;
}





@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],


  encapsulation: ViewEncapsulation.None // CDF not sure I want this
})


export class AppComponent implements OnInit/*, AfterViewInit*/ {
      private myFileInputIdentifier:string = "tHiS_Id_IS_sPeeCiAL";
      public actionLog:string="";
      @ViewChild('tableErrors') tableErrors: Table;
      @ViewChild('tableImport') tableImport: Table; // cdf this will map to the Prime ng turbo table in my HTML template


      data: any [];
      dataMapRow: any [];

      SizeData: number;
      SizeCols: number;
      FieldNames: any [];
      Keys: any [];

      selectedRow: any;
      aColumn: Column;
      aCols: Column[];

      ErrorCols: Array<Column>;

      MapJSONString: string = "";

      aFieldDef: FieldDef;
      FieldDefs: FieldDef[];

      FieldMapping: FieldMapItem;

      ImportTypes: ImportType[];
      selectedImportType: ImportType;

      ErrorList: ErrorType[];
      selRowErrorList: ErrorType[];

      MapOptions: MapOption[];
      MapLayout: FieldMapItem[];  // this will be used to hold the current field mappings that are applied to the
                                  // column in the currently loaded grid ideally we can save this back to the
                                  // backend API to be used again at a later time
      MapOptionsDropdown: Dropdown;

      Display = false;

      constructor ( private ng2FileInputService: Ng2FileInputService,
                    private papa: PapaParseService,
                    private DataImportService: DataImportService,
                    private cd: ChangeDetectorRef
                     ) {
      }

      getImportTypes(): void {
        this.DataImportService.getImportTypes()
        .subscribe(ImportTypes => this.ImportTypes = ImportTypes);
        console.log(this.ImportTypes);
      }

      getMapFieldOptions(ImportID: number): void {
        this.DataImportService.getMapFieldOptions(ImportID)
        .subscribe(MapOptions => this.MapOptions = MapOptions);
      }


      getErrorList(): void {
        this.DataImportService.getErrorList()
        .subscribe(ErrorList => this.ErrorList = ErrorList);
        console.log(this.ErrorList);
      }


      public initTable(tableInp: Table) {
        tableInp.columns = this.aCols; // cdf set column headers
        tableInp.dataKey = tableInp.columns[0].field; // this is needed for rowexpansion might need to be unique
        tableInp.value = this.data;    // cdf load the value of the cells from the array into the table object
        tableInp.frozenValue = this.dataMapRow; // maprow
        tableInp.paginator = true;
        tableInp.rows = 10;
        tableInp.responsive = false;
        tableInp.rowHover = true;
        tableInp.pageLinks = 5;
        tableInp.rowsPerPageOptions = [5, 10, 20, 100, 1000];
        tableInp.resizableColumns = true; // column headers overlap without this
        tableInp.scrollable = true; // frozen row dissapears if this is not set to true
      }

      public initTableErrors(tableInp: Table) {

        if (tableInp !== undefined) {
      //  tableInp.columns = this.initErrCols(); // cdf set column headers
        this.ErrorCols = this.initErrCols(); // cdf set column headers
      //  tableInp.value = this.selRowErrorList;    // cdf load the value of the cells from the array into the table object
        tableInp.paginator = false;
        tableInp.rows = 20;
        tableInp.responsive = true;
        tableInp.rowHover = true;
        tableInp.pageLinks = 5;
        tableInp.resizableColumns = true; // column headers overlap without this
        tableInp.scrollable = true; // frozen row dissapears if this is not set to true
        }
      }


      public initMapRow(RowInp: any []) {
        this.MapJSONString = '{'; // formatting a string so it can be converted to JSON
        for (let i in this.Keys) {
                  this.MapJSONString = this.MapJSONString + '"' + this.Keys[i]+ '"'+ ':' + '"' +'Map Column' + '"' + ',';
                }

        this.MapJSONString = this.MapJSONString.substr(0, (this.MapJSONString.length - 1)); // remove last comma
        this.MapJSONString = this.MapJSONString + '}'; // closing JSON format
        console.log(this.MapJSONString);
        RowInp.unshift(JSON.parse(this.MapJSONString));// Add it to first row of the table in order to list fields that may be mapped for import
      }

      public addPrimaryKey(data: any []) {
        let fi: FieldItem;
        let cnt: number;

        cnt = 1;
        for (const i in data) {
          fi = new FieldItem;
          fi.PK = cnt;
          cnt++;
          data[i] =  Object.assign(fi, data[i]);
        
        }
      }

      public initErrCols (): Array<Column>  {
        let aCols: Array<Column> ;
        let aColumn: Column;

        aCols = new Array<Column>();
        aColumn = new Column; // need a new object each time to add new item to array
        aColumn.field = 'row';
        aColumn.header = 'Row';
        aColumn.editable = false;
        aCols.push(aColumn);


        aColumn = new Column; // need a new object each time to add new item to array
        aColumn.field = 'column';
        aColumn.header = 'Column';
        aColumn.editable = false;
        aCols.push(aColumn);

        aColumn = new Column; // need a new object each time to add new item to array
        aColumn.field = 'description';
        aColumn.header = 'Description';
        aColumn.editable = false;
        aCols.push(aColumn);

        return aCols;
      }

      public initCols(keys: any[]): Array<Column> {

       let aCols: Array<Column> ;
       let aColumn: Column;

       aCols = new Array<Column>();
       if (keys == null) { // if its null or undefined array then
         aColumn = new Column; // need a new object each time to add new item to array
         aColumn.field = 'Load Table';
         aColumn.header = 'Load Table';
         aColumn.editable = true;
         aCols.push(aColumn)}
       else {

         for (let i in keys) {
           aColumn = new Column;
           aColumn.field = keys[i];
           aColumn.header = keys[i];
           aColumn.editable = true;
           aCols.push(aColumn)}

       }
         return aCols;

      }

      public initData(RowCount: number) {
        let i: number;
        let EmptyRows: any[];

        i = 0;

        EmptyRows = new Array<FieldMapItem> ();
        while (i <= RowCount) {
          EmptyRows.push('a', ''); // just fill up with empty rows
          i++;
        }

        this.aCols = this.initCols(null);
        this.data = EmptyRows;
      }


      public errorsByRowID(RowID: number, ErrorList: Array<ErrorType> ): Array<ErrorType> {
        return ErrorList.filter(ErrorType => ErrorType.row === RowID);
      }

      public errorsByRowIDcolumnIndex(RowID: number, columnIndex: number, ErrorList: Array<ErrorType> ): Array<ErrorType> {
        return ErrorList.filter(ErrorType => (ErrorType.row === RowID && ErrorType.column === columnIndex)); // Match by column and row
      }


      public errorInCell(RowID: number, columnIndex: number):boolean {
         let Errors: Array<ErrorType>;
         Errors = new Array<ErrorType>();
         Errors = this.errorsByRowIDcolumnIndex(RowID, columnIndex, this.ErrorList);
         return (Errors.length > 0);
      }



      ngOnInit(): void {

        this.getImportTypes(); // list of all possible imports

        this.selectedImportType = new ImportType;
        this.selectedImportType.label = 'N/A';
        this.selectedImportType.value = 0;

        this.initData(10);

        this.FieldNames = Object.values(this.data[0]);
        this.Keys = Object.keys(this.data[0]);

        this.dataMapRow = new Array();
        this.initMapRow(this.dataMapRow);

        this.initTable(this.tableImport);
        this.initTableErrors(this.tableErrors);

        console.log(this.tableErrors);

     }

    /* ngAfterViewInit() {
          this.initTableErrors(this.tableErrors);
     }*/

      public onAction(event: any) {
        console.log(event);
        this.actionLog += "\n currentFiles: " + this.getFileNames(event.currentFiles);
        console.log(this.actionLog);
      }



      public onChange(rowData: Row, label: string, fieldname: string) {
        for (let i in rowData) {
          if (i == fieldname) {
          rowData[i] = label; // this will update the cell with the proper label coming from the dropdown seems
                              // like a bug that the value displays instead by default...
          }
          else
           {if ((rowData[i].toString() == label.toString()) && (i.trim() !== fieldname)) {
            rowData[i] = 'Map Column'; // this will revert any column that was previosly mapped to this field

           }
          }
        }
      }





      SetRowStyle(rowData, rowIndex) { // this is to hightlight the first row for mapping
        if (rowIndex === 0) {
          return 'set-row';
        }
        return 'set-row-default';
      }


      public onChangeImp(SelImportType: any) {
        console.log(SelImportType);
        this.selectedImportType.value = SelImportType[0].value;
        this.selectedImportType.label = SelImportType[0].label;

        this.getMapFieldOptions(this.selectedImportType.value);
        console.log(this.selectedImportType);
      }



      public   UpdateMapping(MapId: number, ColIndex: number, FieldMapItems: FieldMapItem[]) {
        let aFieldMapItem: FieldMapItem;
        let ItemFound: boolean = false;

        // Go the the array of mapped fields and try to see if there is already an entry for the column being mapped,
        // if so then update it with the new mapping that was input at that index
        FieldMapItems.forEach((element) => { // try to find out if mapping already exists, if so then update the MapId since it has changed
          if (element.ColumnIndex =  ColIndex) {
            element.MapId = MapId;
            ItemFound = true;
          }
        });

        if (!ItemFound) { // if there is no matching item then add the map item to the array
          aFieldMapItem = new FieldMapItem;
          aFieldMapItem.ColumnIndex = ColIndex;
          aFieldMapItem.MapId = MapId;
          this.MapLayout.push(aFieldMapItem);
        }
      }


      public onEditableInputChange(event: any) {
        console.log(event);
      }

      public onItemClick(event: any) {
        console.log(event);
      }

      public Validate(event: any){
        this.getErrorList();
      }




      onPageChange(event: any) {
        if (event.page > 1) {
          return 'set-row-default';
        }
      }

      onRowExpand(event: any) {
        this.selRowErrorList = this.errorsByRowID(event.data.PK, this.ErrorList);
        this.initTableErrors(this.tableErrors);


       console.log(this.selRowErrorList);
      }

      GetErrorStatusStyle(CellIndex: number, Rowindex: number) {
        if (this.errorInCell(Rowindex, CellIndex)) {
          return 'set-error-cell';
        }
        else {
           return 'set-no-error-cell';
        }
      }


    /*  GetErrorStatusStyle(thing: any) {
          console.log(thing);
          return 'set-no-error-cell';

      }*/


      public onAdded(event: any){
        this.actionLog += '\n FileInput: ' + event.id;
        this.actionLog += "\n Action: File added";


        const config = {
          delimiter: "",  // auto-detect
          newline: "",  // auto-detect
          quoteChar: '"',
          header: true,
          dynamicTyping: false,
          preview: 0,
          encoding: "",
          worker: false,
          comments: false,
          step: undefined,
          complete: undefined,
          error: undefined,
          download: false,
          skipEmptyLines: false,
          chunk: undefined,
          fastMode: undefined,
          beforeFirstChunk: undefined,
          withCredentials: undefined
        };

        const myfiles: File[] = this.ng2FileInputService.getCurrentFiles(event.id);

          this.papa.parse(myfiles[0], {header: true,  // this is an important setting to determine if it will be json or array of arrays
            complete: (results, file) => {
                this.data = results.data;

                this.addPrimaryKey(this.data);

                this.FieldNames = Object.values(this.data[0]);
                this.Keys = Object.keys(this.data[0]);

                this.SizeCols = this.FieldNames.length;
                this.SizeData = this.data.length;
                this.FieldDefs = new Array();

                this.aCols = this.initCols(this.Keys);
                this.dataMapRow = new Array(); // cdf may need to free previous instance of array mem leak?
                this.initMapRow(this.dataMapRow);
                this.initTable(this.tableImport);
                this.getMapFieldOptions(this.selectedImportType.value);
                this.getImportTypes();

            }
        });

      }

      showDialog() {
        this.Display = true;
      }

      public onRemoved(event: any){
        this.actionLog += "\n FileInput: " + event.id;
        this.actionLog += '\n Action: File removed';
      }
      public onInvalidDenied(event: any){
        this.actionLog += '\n FileInput: ' + event.id;
        this.actionLog += '\n Action: File denied';
      }
      public onCouldNotRemove(event: any){
        this.actionLog += '\n FileInput: ' + event.id;
        this.actionLog += '\n Action: Could not remove file';
      }
      public resetFileInput(): void{
        this.ng2FileInputService.reset(this.myFileInputIdentifier);
      }
      public logCurrentFiles(): void{
        const files = this.ng2FileInputService.getCurrentFiles(this.myFileInputIdentifier);
        this.actionLog += '\n The currently added files are: ' + this.getFileNames(files);
      }
      private getFileNames(files: File[]): string{
        const names = files.map(file => file.name);
        return names ? names.join(', ') : 'No files currently added.';
      }
    }
