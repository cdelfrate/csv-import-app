import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {



    const MapFieldOptions = [
      { value: 1, label: 'Part Number'},
      { value: 2, label: 'Description' },
      { value: 3, label: 'Hazmat'      },
      { value: 4, label: 'Serialized'   },
      { value: 5, label: 'Stuff'}
    ];

    const ImportTypes  = [
      { value: 1, label: 'Part Master' },
      { value: 2, label: 'Customer Quotes' },
      { value: 3, label: 'Companies'      },
      { value: 4, label: 'Stock'  }
    ];

    const PartsMasterMapFields  = [
      { value: 1, label: 'Part Number' },
      { value: 2, label: 'Description' },
      { value: 3, label: 'Hazmat'      },
      { value: 4, label: 'Serialized'  }
    ];


    const CompaniesMapFields  = [
      { value: 1, label: 'Name'  },
      { value: 2, label: 'City'  },
      { value: 3, label: 'State' },
      { value: 4, label: 'Zip'   }
    ];



    const ErrorList  = [
      { row: 1,  column : 5, description: 'date format'  },
      { row: 10, column : 3, description: 'number required' },
      { row: 12, column : 2, description: 'Name'  },
      { row: 15, column : 6, description: 'overflow'  }
    ];


    return {MapFieldOptions, ImportTypes, PartsMasterMapFields, CompaniesMapFields, ErrorList};
  }

}
