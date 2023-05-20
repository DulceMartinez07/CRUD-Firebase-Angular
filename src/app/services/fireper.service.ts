import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FireperService {

  constructor( private fires: AngularFirestore) { }

  getPersonas(){
    return this.fires.collection('personas').snapshotChanges();
  }
  addPersonas(payload: personasI){
    return this.fires.collection('personas').add(payload);
  }
  updatePersonas(personasID: string, payload: personasI){
    return this.fires.doc('personas/' + personasID).update(payload);
  }
  deletePersonas(personasID: string){
    return this.fires.doc('personas/' + personasID).delete();
  }
}

export interface personasI {
  id?: string;
  nombre: string;
  apellido: string;
}

