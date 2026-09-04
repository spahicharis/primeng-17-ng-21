import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class JsonService {
    private http = inject(HttpClient);


    getVersions() {
        return this.http
            .get<any>('https://www.primefaces.org/primeng/versions.json')
            .toPromise()
            .then((res) => res.versions)
            .then((data) => {
                return data;
            });
    }

    getAnnouncement() {
        return this.http
            .get<any>('https://www.primefaces.org/cdn/news/primeng.json')
            .toPromise()
            .then((data) => {
                return data;
            });
    }
}
