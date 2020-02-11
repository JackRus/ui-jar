import { NgModule, Injector, ModuleWithProviders } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { appStateReducer } from './content/app-state-reducer';
import { AppStateEffects } from './effects/app-state-effects';
import { ApiEffects } from './effects/api-effects';
import { JarNgrxConfig } from './content/state-models';



@NgModule({
  declarations: [],
  imports: [
      EffectsModule.forRoot([AppStateEffects, ApiEffects]),
      StoreModule.forRoot(appStateReducer)
  ],
  exports: []
})
export class JarNgrxModule {

  // TO BE USED THROUGHOUT THE LIBRARY
  static injector: Injector = null;

  constructor(injector: Injector) {
    JarNgrxModule.injector = injector;
  }

  /**
   * Optional library settings
   * @param config JarNgrxConfig
   */
  static forRoot(config?: JarNgrxConfig): ModuleWithProviders {
    return {
      ngModule: JarNgrxModule,
      providers: config ? [{ provide: 'JAR_NGRX_CONFIG', useValue: config }] : []
    }
  }
}
