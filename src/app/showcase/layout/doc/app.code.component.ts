import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Input, NgModule, PLATFORM_ID, ViewChild, booleanAttribute, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Code, ExtFile, RouteFile } from 'src/app/showcase/domain/code';
import { useCodeSandbox, useStackBlitz } from './codeeditor';

@Component({
    selector: 'app-code',
    template: `
        @if (code) {
          <div class="doc-section-code">
            <div class="doc-section-code-buttons scalein animation-duration-300">
              @if (fullCodeVisible) {
                @if (code.html) {
                  <button (click)="changeLang('html')" class="py-0 px-2 border-round h-2rem" [ngClass]="{ 'code-active': lang === 'html' }"><span>HTML</span></button>
                }
                @if (code.typescript) {
                  <button (click)="changeLang('typescript')" class="py-0 px-2 border-round h-2rem" [ngClass]="{ 'code-active': lang === 'typescript' }"><span>TS</span></button>
                }
                @if (code.scss) {
                  <button (click)="changeLang('scss')" class="py-0 px-2 border-round h-2rem" [ngClass]="{ 'code-active': lang === 'scss' }"><span>SCSS</span></button>
                }
                @if (code.data) {
                  <button
                    pTooltip="View Data"
                    tooltipPosition="bottom"
                    tooltipStyleClass="doc-section-code-tooltip"
                    (click)="changeLang('data')"
                    class="h-2rem w-2rem p-0 inline-flex align-items-center justify-content-center"
                    [ngClass]="{ 'doc-section-code-active text-primary': lang === 'data' }"
                    >
                    <i class="pi pi-database"></i>
                  </button>
                }
              }
              @if (!hideToggleCode) {
                <button pTooltip="Toggle Full Code" tooltipStyleClass="doc-section-code-tooltip" tooltipPosition="bottom" class="h-2rem w-2rem p-0 inline-flex align-items-center justify-content-center" (click)="toggleCode()">
                  <i class="pi pi-code"></i>
                </button>
              }
              @if (!hideStackBlitz && !hideToggleCode) {
                <button
                  pTooltip="Edit in StackBlitz"
                  tooltipPosition="bottom"
                  tooltipStyleClass="doc-section-code-tooltip"
                  class="h-2rem w-2rem p-0 inline-flex align-items-center justify-content-center"
                  (click)="openStackBlitz()"
                  >
                  <svg role="img" width="13" height="18" viewBox="0 0 13 19" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: 'block'">
                    <path d="M0 10.6533H5.43896L2.26866 18.1733L12.6667 7.463H7.1986L10.3399 0L0 10.6533Z" />
                  </svg>
                </button>
              }
              <button type="button" class="h-2rem w-2rem p-0 inline-flex align-items-center justify-content-center" (click)="copyCode()" pTooltip="Copy Code" tooltipPosition="bottom" tooltipStyleClass="doc-section-code-tooltip">
                <i class="pi pi-copy"></i>
              </button>
            </div>
            @if (lang === 'basic') {
              <pre class="language-markup"><code #codeElement>
                {{code.basic}}
              </code></pre>
            }
            @if (lang === 'html') {
              <pre class="language-markup"><code #codeElement>
                {{code.html}}
              </code></pre>
            }
            @if (lang === 'typescript') {
              <pre class="language-typescript"><code #codeElement>
                {{code.typescript}}
              </code></pre>
            }
            @if (lang === 'data') {
              <pre class="language-json"><code #codeElement>
                {{code.data}}
              </code></pre>
            }
            @if (lang === 'scss') {
              <pre class="language-scss"><code #codeElement>
                {{code.scss}}
              </code></pre>
            }
            @if (lang === 'command') {
              <pre class="language-shell"><code #codeElement>
                {{code.command}}
              </code></pre>
            }
          </div>
        }
        `,
    standalone: false
})
export class AppCodeComponent {
    platformId = inject(PLATFORM_ID);
    document = inject<Document>(DOCUMENT);

    @Input() code!: Code;

    @Input() service!: any;

    @Input() selector!: string;

    @Input() extFiles: ExtFile[] = [];

    @Input() routeFiles: RouteFile[] = [];

    @Input({ transform: booleanAttribute }) hideToggleCode: boolean = false;

    @Input({ transform: booleanAttribute }) hideCodeSandbox: boolean = false;

    @Input({ transform: booleanAttribute }) hideStackBlitz: boolean = false;

    @ViewChild('codeElement') codeElement: ElementRef;

    fullCodeVisible: boolean = false;

    lang!: string;

    ngAfterViewChecked() {
        if (isPlatformBrowser(this.platformId)) {
            if (window['Prism'] && this.codeElement && !this.codeElement.nativeElement.classList.contains('prism')) {
                window['Prism'].highlightElement(this.codeElement.nativeElement);
                this.codeElement.nativeElement.classList.add('prism');
                this.codeElement.nativeElement.parentElement.setAttribute('tabindex', '-1');
            }
        }
    }

    ngOnInit() {
        this.lang = this.getInitialLang();
    }

    changeLang(lang: string) {
        this.lang = lang;
    }

    getInitialLang(): string {
        if (this.code) {
            return Object.keys(this.code)[0];
        }
    }

    async copyCode() {
        await navigator.clipboard.writeText(this.code[this.lang]);
    }

    getCode(lang: string = 'basic') {
        if (this.code) {
            if (this.fullCodeVisible || this.hideToggleCode) {
                return this.code[lang];
            } else {
                return this.code['basic'];
            }
        }
    }

    toggleCode() {
        this.fullCodeVisible = !this.fullCodeVisible;
        this.fullCodeVisible && (this.code.html ? (this.lang = 'html') : (this.lang = 'typescript'));
        !this.fullCodeVisible && (this.lang = 'basic');
    }

    openStackBlitz() {
        if (this.code) {
            let str = this.code.typescript;

            const importModuleStatement = "import { ImportsModule } from './imports';";

            if (!str.includes(importModuleStatement)) {
                let modifiedCodeWithImportsModule = str.replace(/import\s+{[^{}]*}\s+from\s+'[^']+';[\r\n]*/g, (match) => {
                    if (match.includes('Module') && !match.includes('ReactiveFormsModule')) {
                        return '';
                    }
                    return match;
                });

                modifiedCodeWithImportsModule = modifiedCodeWithImportsModule.replace(/\bimports:\s*\[[^\]]*\]/, 'imports: [ImportsModule]');

                const finalModifiedCode = modifiedCodeWithImportsModule.replace(/import\s+\{[^{}]*\}\s+from\s+'@angular\/core';/, (match) => match + '\n' + importModuleStatement);

                str = finalModifiedCode;
            }

            const stackBlitzObject = { ...this.code, typescript: str };

            useStackBlitz({ code: stackBlitzObject, selector: this.selector, extFiles: this.extFiles, routeFiles: this.routeFiles });
        }
    }

    openCodeSandbox() {
        if (this.code) {
            useCodeSandbox({ code: this.code, selector: this.selector, extFiles: this.extFiles, routeFiles: this.routeFiles });
        }
    }
}

@NgModule({
    imports: [CommonModule, ButtonModule, TooltipModule],
    exports: [AppCodeComponent],
    declarations: [AppCodeComponent]
})
export class AppCodeModule {}
