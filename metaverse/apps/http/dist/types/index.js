import { z } from "zod";
export const SignupSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
    type: z.enum(["user", "admin"]),
});
export const SigninSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
    // type:z.enum(["user","admin"]),
});
export const UpdateMetaDataSchema = z.object({
    avatarId: z.string(),
});
export const CrateSpaceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    dimension: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId: z.string(),
});
export const DeleteElementSchema = z.object({
    id: z.string()
});
export const AddElementSchema = z.object({
    spaceId: z.string(),
    elementId: z.string(),
    x: z.number(),
    y: z.number(),
});
export const CreateElementSchema = z.object({
    imageUrl: z.string().url(),
    width: z.number(),
    height: z.number(),
    static: z.boolean(),
});
export const UpdateElementSchema = z.object({
    imageUrl: z.string().url()
});
export const CreateAvatarSchema = z.object({
    name: z.string().min(1, "Name is required"),
    imageUrl: z.string().url()
});
export const CreateMapSchema = z.object({
    thumbnail: z.string(),
    dimension: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    name: z.string(),
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.number(),
        y: z.number(),
    }))
});
