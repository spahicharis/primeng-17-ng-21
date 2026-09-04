import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlatformService {
    private platformId = inject(PLATFORM_ID);
    private document = inject<Document>(DOCUMENT);

    private window: Window;

    constructor() {
        this.window = this.document.defaultView as Window;
    }

    isBrowser(): boolean {
        return isPlatformBrowser(this.platformId) && this.window !== null && this.window !== undefined;
    }
}
