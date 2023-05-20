import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FireperService, personasI } from 'src/app/services/fireper.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  public formPer!: FormGroup;
  public listperson: personasI[]=[];
  public detaperson?: personasI;
  
  constructor( private fb: FormBuilder,
              private modalServices: NgbModal,
              private fireper: FireperService){

                
  }

  ngOnInit(): void {
    this.getpersonas();
  }

  getpersonas(): void{
    this.fireper.getPersonas().subscribe((res)=>{
      this.listperson = res.map((person)=>{
        return{
          ...person.payload.doc.data(),
          id: person.payload.doc.id
        } as personasI;
      });
    });
  }

  openModal(content: TemplateRef<any>, personasID: string): void{
    this.detaperson = this.listperson.find((person: personasI) => person.id === personasID);
    this.formInit(this.detaperson!);
    this.modalServices.open(content, {backdrop: 'static', centered: true});
  }

  formInit(data: personasI): void{
    this.formPer = this.fb.group({
      nombre: [data ? data.nombre: '', Validators.required],
      apellido: [data ? data.apellido: '',Validators.required]
    });
  }

  addpersona(): void {
    this.fireper.addPersonas(this.formPer.value).then();
  }

  updatepersona(personasID: string): void {
    this.fireper.updatePersonas(personasID, this.formPer.value).then();
  }

  deletepersona(personasID: string): void {
    this.fireper.deletePersonas(personasID).then();
  }
}
