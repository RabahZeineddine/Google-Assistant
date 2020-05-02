import * as Joi from '@hapi/joi'

export const assistSchema = Joi.object({
    credentials: Joi.object({
        client_id: Joi.string().required(),
        client_secret: Joi.string().required(),
        token_uri: Joi.string().required(),
        refresh_token: Joi.string().required(),
        scopes: Joi.array()
    }).required(),
    text: Joi.string().required()
})

