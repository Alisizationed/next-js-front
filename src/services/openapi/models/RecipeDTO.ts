/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IngredientDTO } from './IngredientDTO';
import type { JsonNode } from './JsonNode';
import type { Tag } from './Tag';
export type RecipeDTO = {
    id?: number;
    userProfileId?: number;
    image?: string;
    title?: string;
    description?: string;
    content?: JsonNode;
    tags?: Array<Tag>;
    ingredients?: Array<IngredientDTO>;
};

