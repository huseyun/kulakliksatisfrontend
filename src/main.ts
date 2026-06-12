import { platformBrowser } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import { AppModule } from './app/app-module';

registerLocaleData(localeTr);

platformBrowser().bootstrapModule(AppModule, {
  
})
  .catch(err => console.error(err));
