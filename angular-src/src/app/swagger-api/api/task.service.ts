/**
 * TSOA-Node Express
 * TSOA-NodeExpress Documentation
 *
 * OpenAPI spec version: 1.0.1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs/Observable';

import { IErrorResponse } from '../model/iErrorResponse';
import { INewTaskParams } from '../model/iNewTaskParams';
import { ITaskResponse } from '../model/iTaskResponse';
import { IUpdateTaskParams } from '../model/iUpdateTaskParams';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class TaskService {

    protected basePath = 'https://localhost/api';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (let consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * 
     * Create a new task
     * @param requestBody Parameters for a new task
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createTask(requestBody: INewTaskParams, observe?: 'body', reportProgress?: boolean): Observable<ITaskResponse>;
    public createTask(requestBody: INewTaskParams, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ITaskResponse>>;
    public createTask(requestBody: INewTaskParams, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ITaskResponse>>;
    public createTask(requestBody: INewTaskParams, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (requestBody === null || requestBody === undefined) {
            throw new Error('Required parameter requestBody was null or undefined when calling createTask.');
        }

        let headers = this.defaultHeaders;

        // authentication (JWT) required
        if (this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];
        let httpContentTypeSelected:string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set("Content-Type", httpContentTypeSelected);
        }

        return this.httpClient.post<ITaskResponse>(`${this.basePath}/tasks/create`,
            requestBody,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * Get detail of a single task
     * @param slug Task&#39;s slug from API route&#39;s path parameter
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getSingleTask(slug: string, observe?: 'body', reportProgress?: boolean): Observable<ITaskResponse>;
    public getSingleTask(slug: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ITaskResponse>>;
    public getSingleTask(slug: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ITaskResponse>>;
    public getSingleTask(slug: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (slug === null || slug === undefined) {
            throw new Error('Required parameter slug was null or undefined when calling getSingleTask.');
        }

        let headers = this.defaultHeaders;

        // authentication (JWT) required
        if (this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        return this.httpClient.get<ITaskResponse>(`${this.basePath}/tasks/${encodeURIComponent(String(slug))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * Get current authenticated user tasks
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getTasks(observe?: 'body', reportProgress?: boolean): Observable<Array<ITaskResponse>>;
    public getTasks(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<ITaskResponse>>>;
    public getTasks(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<ITaskResponse>>>;
    public getTasks(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // authentication (JWT) required
        if (this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        return this.httpClient.get<Array<ITaskResponse>>(`${this.basePath}/tasks`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * Remove a single task
     * @param slug Task&#39;s slug from API&#39;s route path parameter
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public removeTask(slug: string, observe?: 'body', reportProgress?: boolean): Observable<ITaskResponse>;
    public removeTask(slug: string, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ITaskResponse>>;
    public removeTask(slug: string, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ITaskResponse>>;
    public removeTask(slug: string, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (slug === null || slug === undefined) {
            throw new Error('Required parameter slug was null or undefined when calling removeTask.');
        }

        let headers = this.defaultHeaders;

        // authentication (JWT) required
        if (this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        return this.httpClient.delete<ITaskResponse>(`${this.basePath}/tasks/${encodeURIComponent(String(slug))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * Update a single task
     * @param slug Task&#39;s slug from API route&#39;s path parameter
     * @param updatedTask Parameters to update an existed task
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateTask(slug: string, updatedTask: IUpdateTaskParams, observe?: 'body', reportProgress?: boolean): Observable<ITaskResponse>;
    public updateTask(slug: string, updatedTask: IUpdateTaskParams, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ITaskResponse>>;
    public updateTask(slug: string, updatedTask: IUpdateTaskParams, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ITaskResponse>>;
    public updateTask(slug: string, updatedTask: IUpdateTaskParams, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {
        if (slug === null || slug === undefined) {
            throw new Error('Required parameter slug was null or undefined when calling updateTask.');
        }
        if (updatedTask === null || updatedTask === undefined) {
            throw new Error('Required parameter updatedTask was null or undefined when calling updateTask.');
        }

        let headers = this.defaultHeaders;

        // authentication (JWT) required
        if (this.configuration.apiKeys["Authorization"]) {
            headers = headers.set('Authorization', this.configuration.apiKeys["Authorization"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        let httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set("Accept", httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];
        let httpContentTypeSelected:string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set("Content-Type", httpContentTypeSelected);
        }

        return this.httpClient.put<ITaskResponse>(`${this.basePath}/tasks/${encodeURIComponent(String(slug))}`,
            updatedTask,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
