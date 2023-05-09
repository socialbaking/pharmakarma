import {FastifyInstance, FastifyRequest} from "fastify";
import {listPartners, partnerSchema} from "../data";
import {authenticate} from "./bearer-authentication";
import {getMaybeAuthorizedForPartnerId} from "./authentication";

export async function listPartnerRoutes(fastify: FastifyInstance) {

    const response = {
        200: {
            type: "array",
            items: partnerSchema.partner
        }
    }

    const schema = {
        description: "Retrieve a list of private code data",
        tags: ["partner"],
        summary: "",
        response,
        security: [
            {
                apiKey: [] as string[]
            }
        ]
    };

    fastify.get(
        "/partners",
        {
            schema,
            preHandler: authenticate(fastify, {
                anonymous: true
            }),
            async handler(request: FastifyRequest, response) {
                const authorizedPartnerId = getMaybeAuthorizedForPartnerId();
                response.send(
                    await listPartners({
                        authorizedPartnerId
                    })
                );
            }
        }
    );
}

