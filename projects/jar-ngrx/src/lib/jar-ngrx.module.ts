import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { appStateReducer } from './content/app-state-reducer';
import { AppEffects } from './content/effects';



@NgModule({
  declarations: [],
  imports: [
      EffectsModule.forRoot([AppEffects]),
      StoreModule.forRoot(appStateReducer)
  ],
  exports: []
})
export class JarNgrxModule { }
