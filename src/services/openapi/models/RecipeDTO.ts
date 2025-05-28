/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* eslint-disable */
import type { ContentBlockDTO } from './ContentBlockDTO';
import type { IngredientDTO } from './IngredientDTO';
import type { Tag } from './Tag';
export type RecipeDTO = {
    id?: number;
    userProfileId?: number;
    image?: string;
    title?: string;
    description?: string;
    contentBlocks?: Array<ContentBlockDTO>;
    tags?: Array<Tag>;
    ingredients?: Array<IngredientDTO>;
};

