import {Endpoint, EndpointSource} from "./Endpoint";
import {Client} from "./Client";
import fetch, {RequestInit} from "node-fetch";
import {APIRequestError} from "./APIRequestError";
import FormData, {} from 'form-data'
import {MultipartOptions} from "./RequestOptions";


const HOSTNAME = 's1.umbraco.io'

export class ApiRequest<R = any> {



    constructor(
        private client: Client,
        public endpoint: Endpoint,
        public data?: any
    ) {}





    public promise = async (): Promise<R> => {
        const projectAlias = this.client.options.projectAlias
        let url = `https://${projectAlias}.${HOSTNAME}`




        const requestInit: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json+hal;v=2',
                'umb-project-alias': projectAlias,
                'Accept-Language': this.client.options.language,
                'api-version': '2'
            }
        }

        switch (this.endpoint.source) {
            case EndpointSource.CDN:
                url += `/cdn`
                break
            case EndpointSource.ContentManagement:
                url += '/api'

                if(this.client.getAPIKey() === null) {
                    throw new Error("API Key is missing")
                }

                requestInit.headers["api-key"] = `${this.client.getAPIKey()}`
                break


        }

        url += this.endpoint.getPath()

        console.log("URL:", url)

        console.log("Header fields")
        console.log(requestInit)

        const method = this.endpoint.method.toLowerCase()
        if((method === "post" || method === 'put') && !!this.data) {
            const requestOptions = this.endpoint.options
            if(typeof requestOptions !== "undefined") {
                if((requestOptions as MultipartOptions).usingMultipart) {
                    if(this.data instanceof FormData) {
                        requestInit.headers["Content-Type"] = `multipart/form-data; boundary=${this.data.getBoundary()}`
                        requestInit.body = this.data
                    } else {
                        throw new Error("Expected a FormData as body")
                    }
                }
            }

            if(!requestInit.body) {
                requestInit.body = JSON.stringify(this.data)
            }


            // if((this.endpoint.options !== undefined && this.endpoint.options as MultipartOptions).usingMultipart === true) {
            //     if(this.data instanceof FormData) {
            //         requestInit.headers["Content-Type"] = `multipart/form-data; boundary=${this.data.getBoundary()}`
            //
            //
            //         requestInit.body = this.data
            //     } else {
            //         throw new Error("Expected a FormData as body")
            //     }
            // }
            // else {
            //     requestInit.body = JSON.stringify(this.data)
            // }



        }
        requestInit.method = method

        const response = await fetch(url, requestInit)
        const jsonResponse = await response.json()

        if(!response.ok) {
            console.log(requestInit)
            throw new APIRequestError(response.statusText, response, jsonResponse)
        }


        return jsonResponse as R


    }


}