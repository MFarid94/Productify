import { db } from "./index";
import { eq } from "drizzle-orm";
import { users, comments, products, type NewUser, type NewComment, type NewProduct, } from "./schema";

/* 
Using Partial<NewUser> / Partial<NewProduct> allows callers to mutate identifiers and 
system fields (id, timestamps, and likely userId for product), which can corrupt relational integrity.
So we update by picking only the mutable fields from NewUser and NewProduct, and making them optional with Partial.
*/
type UpdateUserInput = Partial<Pick<NewUser, "email" | "name" | "imageUrl">>;
type UpdateProductInput = Partial<Pick<NewProduct, "title" | "description" | "imageUrl">>;

export const createUser = async (data: NewUser) => {
    const [user] = await db.insert(users).values(data).returning();
    return user;
};

export const getUserById = async (id: string) => {
    return db.query.users.findFirst({where: eq(users.id,id)});
};

export const updateUser = async (id: string, data: UpdateUserInput) => {
    const existingUser = await getUserById(id);
    if(!existingUser){
        throw new Error(`User with id ${id} not found`);
    }

    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
};



export const upsertUser = async (data: NewUser) => {

/*
The current get-then-update/create flow is not atomic and can fail under concurrent requests.
Use DB-native upsert in a single statement to ensure atomicity.
*/

/*     const existingUser = await getUserById(data.id);
    if (existingUser) return updateUser(data.id, data);

    return createUser(data); 
*/

    const [user] = await db
        .insert(users)
        .values(data)
        .onConflictDoUpdate({
            target: users.id,
            set: {
                email: data.email,
                name: data.name ?? null,
                imageUrl: data.imageUrl ?? null,
                updatedAt: new Date(),
            },
        })
        .returning();
    return user;
};

export const createProduct = async (data: NewProduct) => {
    const [product] = await db.insert(products).values(data).returning();
    return product;
};

export const getAllProducts = async () => {
    return db.query.products.findMany({
        with: {user: true},
        orderBy: (products, {desc}) => [desc(products.createdAt)],
    });
};

export const getProductById = async (id: string) => {
    return db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
            user: true,
            comments: {
                with: { user: true},
                orderBy: (comments, {desc}) => [desc(comments.createdAt)],
            }
        }
    })
};

    export const getProductsByUserId = async (userId: string) => {
        return db.query.products.findMany({
            where: eq(products.userId, userId),
            with: {
                user: true,
            },
            orderBy: (products, {desc}) => [desc(products.createdAt)],
        });
    };

    export const updateProduct = async (id: string, data: UpdateProductInput) => {
        const [product] = await db.update(products).set(data).where(eq(products.id, id)).returning();
        return product;
    };

    export const deleteProduct = async (id: string) => {
        const [product] = await db.delete(products).where(eq(products.id, id)).returning();
        return product;
    };

    // COMMENT QUERIES
    export const createComment = async (data: NewComment) => {
    const [comment] = await db.insert(comments).values(data).returning();
    return comment;
    };

    export const deleteComment = async (id: string) => {
    const existingComment = await getCommentById(id);
    if (!existingComment) {
        throw new Error(`Comment with id ${id} not found`);
    }

    const [comment] = await db.delete(comments).where(eq(comments.id, id)).returning();
    return comment;
    };

    export const getCommentById = async (id: string) => {
    return db.query.comments.findFirst({
        where: eq(comments.id, id),
        with: { user: true },
    });
    };