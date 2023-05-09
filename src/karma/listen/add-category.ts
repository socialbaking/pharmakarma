import {FastifyInstance, FastifyRequest} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {addCategory, CategoryData, categorySchema} from "../data";
import {accessToken, allowAnonymous, authenticate} from "./bearer-authentication";

export async function addCategoryRoutes(fastify: FastifyInstance) {


    type Schema = {
        Body: CategoryData
    }

    const response = {
        201: {
            description: "A new Category",
            ...categorySchema.category
        }
    }

    const schema = {
        description: "Add a new Category",
        tags: ["Category"],
        summary: "",
        body: categorySchema.categoryData,
        response
    }

    fastify.post<Schema>(
        "/categories",
        {
            schema,
            preHandler: authenticate(fastify),
            async handler(request, response)  {
                const Category = await addCategory(request.body);

                response.status(201);
                response.send(Category);
            }
        }
    )
}

