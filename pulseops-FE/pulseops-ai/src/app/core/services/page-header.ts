
import { Injectable, signal } from '@angular/core';

@Injectable({
providedIn: 'root'
})
export class PageHeaderService {

readonly title = signal('Dashboard');
readonly subtitle = signal('Hospital Operations Command Center');

setHeader(title: string, subtitle: string) {
this.title.set(title);
this.subtitle.set(subtitle);
}

}
