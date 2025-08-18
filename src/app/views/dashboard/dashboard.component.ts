import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../_service/GF-API/company.service';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { formatDate } from '@angular/common';
@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  collectionPFMonth;
  collectionGFMonth;
  refundPFMonth;
  refundGFMonth;
  collectionPFYear;
  collectionGFYear;
  refundPFYear;
  refundGFYear;
  countcompany;
  countgfcompany;
  countemployee;
  countgfemployee;
  countTotalCollection;
  countTotalRefund;
  countgfemployees;
  resData;
  notification
  myDate
  constructor(private pfservice: CompanyService) {
   
  }

  isLoading = false;

  load(): void {
    this.isLoading = true;
    setTimeout(() => this.isLoading = false, 2000);
  }

  async wait(ms: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  start() {
    this.isLoading = true;
    this.wait(2000).then(() => this.isLoading = false);
  }

  PfcompanyList() {
    this.isLoading = true;
    this.pfservice.CountPfCompanyList().subscribe(res => {
      this.countcompany = res;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    });

  }

  GfcompanyList() {
    this.isLoading = true;
    this.pfservice.CountGFCompanyList().subscribe(res => {
      this.isLoading = false;
      this.countgfcompany = res;
    });

  }


  PfemployeeList() {
    this.isLoading = true;
    this.pfservice.CountPfEmployeeList().subscribe(res => {
      this.isLoading = false;
      this.resData = res;
      this.countemployee = this.resData;
    });

  }

  GfemployeeList() {
    this.pfservice.CountGfEmployeeList().subscribe(res => {
      this.countgfemployee = res;
    });

  }

  TotalCollectionAmount() {
    this.pfservice.TotalCollectionAmount().subscribe(res => {
      // this.countTotalCollection = res['total_collections_amount']
      if (res['total_collections_amount'] == null) {
        this.countTotalCollection = 0;
      } else {
        this.countTotalCollection = res['total_collections_amount'];
      }
    });

  }

  TotalRefundAmount() {
    this.isLoading = true;
    this.pfservice.TotalRefundAmount().subscribe(res => {
      this.isLoading = false;
      if (res['total_refund_amount'] == null) {
        this.countTotalRefund = 0;
      } else {
        this.countTotalRefund = res['total_refund_amount'];
      }
    }, error => {
      this.isLoading = false;
    });
  }

  getTotalPFCollectionMonth() {
    this.pfservice.getTotalPFCollectionMonth().subscribe(res => {
      this.collectionPFMonth = res
    });
  }

  getTotalGFCollectionMonth() {
    this.pfservice.getTotalGFCollectionMonth().subscribe(res => {
      this.collectionGFMonth = res
    });
  }

  getTotalPFRefundMonth() {
    this.pfservice.getTotalPFRefundMonth().subscribe(res => {
      this.refundPFMonth = res
    });
  }

  getTotalGFrefundMonth() {
    this.pfservice.getTotalGFrefundMonth().subscribe(res => {
      this.refundGFMonth = res
    });
  }

  getTotalPFContribution() {
    this.pfservice.getTotalPFContribution().subscribe(res => {
      this.collectionPFYear = res
    });
  }

  getTotalGFContribution() {
    this.pfservice.getTotalGFContribution().subscribe(res => {
      this.collectionGFYear = res
    });
  }

  getTotalPFRefundYear() {
    this.pfservice.getTotalPFRefundYear().subscribe(res => {
      this.refundPFYear = res
    });
  }

  getTotalGFrefundYear() {
    this.pfservice.getTotalGFrefundYear().subscribe(res => {
      this.refundGFYear = res
    });
  }

  public mainChartElements = 50;
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];

  public lineChartData: Array<any> = [
    { data: [20, 59, 80, 81, 56, 55, 40, 40, 10, 20, 15, 27], label: '% PF Collection' },
    { data: [28, 48, 40, 19, 86, 27, 90, 40, 10, 20, 15, 27], label: '% GF Collection' },
    { data: [28, 48, 40, 19, 86, 27, 90, 40, 10, 20, 15, 27], label: '% PF Refund' },
    { data: [18, 48, 77, 9, 100, 27, 40, 40, 10, 20, 15, 27], label: '% GF Refund' }
  ];
  public lineChartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public lineChartOptions: any = {
    animation: false,
    responsive: true
  };

  // barChart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['PF Collection', 'GF Collection', 'PF Refund', 'GF Refund'];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData: any[] = [
    { data: [20,'','','','','',''], label: '% PF Collection' },
    { data: ['', 48, '', '','',''], label: '% GF Collection' },
    { data: ['', '', 40, '', '', ''], label: '% PF Refund' },
    { data: ['', '', '', 78, '', ''], label: '% GF Refund' }
  ];

  public lineChartColours: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  radioModel: string = 'Month';

  // lineChart1
  public lineChart1Data: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Series A'
    }
  ];
  public lineChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 40 - 5,
          max: 84 + 5,
        }
      }],
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart1Colours: Array<any> = [
    {
      backgroundColor: getStyle('--primary'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart1Legend = false;
  public lineChart1Type = 'line';

  // lineChart2
  public lineChart2Data: Array<any> = [
    {
      data: [1, 18, 9, 17, 34, 22, 11],
      label: 'Series A'
    }
  ];
  public lineChart2Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart2Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 1 - 5,
          max: 34 + 5,
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart2Colours: Array<any> = [
    { // grey
      backgroundColor: getStyle('--info'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart2Legend = false;
  public lineChart2Type = 'line';


  // lineChart3
  public lineChart3Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'Series A'
    }
  ];
  public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChart3Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart3Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
    }
  ];
  public lineChart3Legend = false;
  public lineChart3Type = 'line';


  // barChart1
  public barChart1Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
      label: 'Series A',
      barPercentage: 0.6,
    }
  ];
  public barChart1Labels: Array<any> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
  public barChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
   
      }],
      yAxes: [{
    
      }]
    },
    legend: {
      display: false
    }
  };
  public barChart1Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.3)',
      borderWidth: 0
    }
  ];
  public barChart1Legend = false;
  public barChart1Type = 'bar';

  // mainChart


  public mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Current'
    },
    {
      data: this.mainChartData2,
      label: 'Previous'
    },
    {
      data: this.mainChartData3,
      label: 'BEP'
    }
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  /* tslint:enable:max-line-length */
  public mainChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function (tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
     
      }],
      yAxes: [{
     
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public mainChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: hexToRgba(getStyle('--info'), 10),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: 'transparent',
      borderColor: getStyle('--success'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: getStyle('--danger'),
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];
  public mainChartLegend = false;
  public mainChartType = 'line';

  // social box charts

  public brandBoxChartData1: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Facebook'
    }
  ];
  public brandBoxChartData2: Array<any> = [
    {
      data: [1, 13, 9, 17, 34, 41, 38],
      label: 'Twitter'
    }
  ];
  public brandBoxChartData3: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'LinkedIn'
    }
  ];
  public brandBoxChartData4: Array<any> = [
    {
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Google+'
    }
  ];

  public brandBoxChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public brandBoxChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
       
      }],
      yAxes: [{
   
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public brandBoxChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public brandBoxChartLegend = false;
  public brandBoxChartType = 'line';

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  data:any;
  ngOnInit(): void {
    // generate random values for mainChart
    for (let i = 0; i <= this.mainChartElements; i++) {
      this.mainChartData1.push(this.random(50, 200));
      this.mainChartData2.push(this.random(80, 100));
      this.mainChartData3.push(65);
    }
    this.pfservice.userNotification(localStorage.getItem('id')).subscribe(response=>{
      if(response['status'] === 'success'){
         this.data = response['message']
      }
    },error=>{
    })
    this.PfcompanyList();
    this.TotalRefundAmount();
    this.GfcompanyList();
    this.GfemployeeList();
    this.TotalCollectionAmount();
    this.PfemployeeList();
    this.getTotalPFCollectionMonth();
    this.getTotalGFCollectionMonth();
    this.getTotalPFRefundMonth();
    this.getTotalGFrefundMonth();

    this.getTotalPFContribution();
    this.getTotalGFContribution();
    this.getTotalPFRefundYear();
    this.getTotalGFrefundYear();
  }
}
