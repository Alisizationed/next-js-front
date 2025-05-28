/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ImageControllerService {
    /**
     * @param formData
     * @returns string OK
     * @throws ApiError
     */
    public static saveImage(
        formData?: {
            image: Blob;
        },
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/recipe/images',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @param filename
     * @returns binary OK
     * @throws ApiError
     */
    public static getImage(
        filename: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/recipe/images/{filename}',
            path: {
                'filename': filename,
            },
        });
    }
    /**
     * @param filename
     * @returns string OK
     * @throws ApiError
     */
    public static getImageV2(
        filename: string,
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/recipe/images/v2/{filename}',
            path: {
                'filename': filename,
            },
        });
    }
}
