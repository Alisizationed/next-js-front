/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserProfile } from '../models/UserProfile';
import type { UserProfileDTO } from '../models/UserProfileDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserProfileControllerService {
    /**
     * @param id
     * @returns UserProfile OK
     * @throws ApiError
     */
    public static getUserProfile(
        id: number,
    ): CancelablePromise<UserProfile> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{id}',
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
    public static updateUserProfile(
        id: number,
        formData?: {
            files: Blob;
            body: UserProfileDTO;
        },
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user/{id}',
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
    public static deleteUserProfile(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns UserProfile OK
     * @throws ApiError
     */
    public static getAllUserProfiles(): CancelablePromise<Array<UserProfile>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/',
        });
    }
    /**
     * @param formData
     * @returns string OK
     * @throws ApiError
     */
    public static saveUserProfile(
        formData?: {
            files: Blob;
            body: UserProfileDTO;
        },
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
}
