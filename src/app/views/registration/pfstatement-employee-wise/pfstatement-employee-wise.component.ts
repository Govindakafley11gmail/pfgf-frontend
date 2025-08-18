import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {PfemployeeService} from '../../_service/pfemployee/pfemployee.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pfstatement-employee-wise',
  templateUrl: './pfstatement-employee-wise.component.html',
  styleUrls: ['./pfstatement-employee-wise.component.scss']
})
export class PfstatementEmployeeWiseComponent implements OnInit {
  empName;
  employeeName;
  pfStatementEmpWise: FormGroup;
  emp_name;
  ispfstatement;
  showgeneratediv = false
  constructor(private employee:PfemployeeService,private fb:FormBuilder) { }

  ngOnInit(): void {
    this.employeeWiseFormControl()
    this.getEmployeeName()
  }
  employeeWiseFormControl(){
    this.pfStatementEmpWise = this.fb.group({
      fromDate:'',
      toDate:'',
      employee_name:'',
      emp_cid:''
    })
  }
  getEmployeeName(){
    this.employee.getPfEmployeeDetails().subscribe(res=>{
         this.employeeName = res
         console.log( this.employeeName)

    })
  }

  submitPFStatement(){
    this.showgeneratediv = true
     this.ispfstatement = true;
      console.log(this.pfStatementEmpWise.value);
  }
  changeEmployeeName(){
    this.emp_name = true
  }
  downloadPfstatementByEmpWise(){
    this.showgeneratediv = false;
    var data = document.getElementById('contentToConvert');

    html2canvas(data).then(canvas => {
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('/assets/img')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      localStorage.setItem('rres', JSON.stringify(pdf.save('MYPdf.pdf'))); // Generated PDF
    });
  }
  selectedSimpleItem = []
  customSearchFn(term: string, item: any) {

    term = term.toLocaleLowerCase();
    return item.employee_name.toLocaleLowerCase().indexOf(term) > -1 || item.company_pf_acc_no.toLocaleLowerCase().indexOf(term) > -1;
  }
}


