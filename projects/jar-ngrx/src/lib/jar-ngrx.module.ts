import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { appStateReducer } from './content/app-state-reducer';



@NgModule({
  declarations: [],
  imports: [
      EffectsModule.forRoot(),
      StoreModule.forRoot(appStateReducer)
  ],
  exports: []
})
export class JarNgrxModule { }
