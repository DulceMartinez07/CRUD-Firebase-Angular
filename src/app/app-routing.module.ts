import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonaComponent } from './components/persona/persona.component';

const routes: Routes = [
  { path: '', redirectTo:'persona', pathMatch:'full'},
  { path: 'persona', component:PersonaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
