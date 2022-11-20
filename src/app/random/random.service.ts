import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Random {
  randomApiUrl: string;
}

/**
 * RANDOM.ORG is a true random number service that generates randomness via atmospheric noise.
 * see https://www.random.org/clients/http/api/
 */
@Injectable()
export class RandomService {
  private randomIntegersURL = 'https://www.random.org/integers/';

  constructor(private http: HttpClient) { }

  async getRandom(num: number, min: number, max: number): Promise<number[] | number> {
    const res = await this.http.get<Random>(this.randomIntegersURL, {
      headers: {
        'Accept': 'text/plain;charset=UTF-8'
      },
      params: {
        num: num + '',
        min: min + '',
        max: max + '',
        col: '1',
        base: '10',
        format: 'plain',
        rnd: 'new'
      },
      // @ts-ignore
      observe: 'response',
      // @ts-ignore
      responseType: 'text'
    })
      .pipe(
        catchError(this.handleError)
      )
      .toPromise();

    // convert to number[] or number
    // @ts-ignore
    let convBody = res.body;
    if (convBody[convBody.length - 1] === '\n') {
      convBody = convBody.slice(0, -1);
    }
    convBody = convBody.split('\n').map((num: string) => (Number(num)));

    return !num ? convBody[0] : convBody;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something unexpected happened; please try again later.'));
  }
}
