import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Redspot } from './redspot';

@Injectable()
export class RedspotService {
    private headers = new Headers({'Content-type': 'application/json'});
    private redspotsUrl = 'api/redspots';

    constructor(private http: Http) {}

    getRedspots(): Promise<Redspot[]> {
        return this.http.get(this.redspotsUrl)
                        .toPromise()
                        .then(response => response.json() as Redspot[])
                        .catch(this.handleError);
    }

    getRedspot(name: number): Promise<Redspot> {
        const url = `${this.redspotsUrl}/${name}`;
        return this.http.get(url)
                        .toPromise()
                        .then(response => response.json() as Redspot)
                        .catch(this.handleError);
    }

    delete(name: string): Promise<void> {
        const url = `${this.redspotsUrl}/${name}`;
        return this.http.delete(url, {headers: this.headers})
          .toPromise()
          .then(() => null)
          .catch(this.handleError);
      }

    add(name: string): Promise<Redspot> {
        return this.http
          .post(this.redspotsUrl, JSON.stringify({name: name}), {headers: this.headers})
          .toPromise()
          .then(res => res.json() as Redspot)
          .catch(this.handleError);
    }

    update(redspot: Redspot): Promise<Redspot> {
        const url = `${this.redspotsUrl}/${redspot.name}`;
        return this.http
          .put(url, JSON.stringify(redspot), {headers: this.headers})
          .toPromise()
          .then(() => redspot)
          .catch(this.handleError);
    }

    search(term: string): Observable<Redspot[]> {
        return this.http.get(`api/redspots/?name=${term}`)
                        .map(response => response.json() as Redspot[]);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
