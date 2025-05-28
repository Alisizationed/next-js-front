/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecipeDTO } from '../models/RecipeDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RecipeControllerService {
    /**
     * @param id
     * @returns RecipeDTO OK
     * @throws ApiError
     */
    public static getRecipe(
        id: number,
    ): CancelablePromise<RecipeDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/recipe/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param formData
     * @returns string OK
     * @throws ApiError
     */
    public static updateRecipe(
        id: number,
        formData?: {
            image: Blob;
            body: RecipeDTO;
        },
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/recipe/{id}',
            path: {
                'id': id,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static deleteRecipe(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/recipe/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns RecipeDTO OK
     * @throws ApiError
     */
    public static getAllRecipes(): CancelablePromise<Array<RecipeDTO>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/recipe/',
        });
    }
    /**
     * @param formData
     * @returns string OK
     * @throws ApiError
     */
    public static saveRecipe(
        formData?: {
            image: Blob;
            body: RecipeDTO;
        },
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/recipe/',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
}
