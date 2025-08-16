import Joi from "joi";

class JoiError extends Error {
    isJoi: boolean;
    data: any;
    constructor(data: any) {

        super();

        this.isJoi = true;
        this.data = data;
    }
}

const Validate = (schema: any, request: any) => {
    const result = schema.validate(request, {
        abortEarly: true,
        allowUnknown: false
    });

    if (result.error) {
        let details: Record<string, string> = {};
        for (let i = 0; i < result.error.details.length; i++) {
            const detail = result.error.details[i];

            const key: string = detail.context.key;
            const message = detail.message.replaceAll('\"', '')
            details[key] = message;

            // toastError(new Error(message));
        }
        throw new JoiError(details);
    } else {
        return result.value;
    }
}

export { Validate }


export const IsEmail = Joi.string().email({ tlds: { allow: false } }).trim().max(100).label("Email");
export const IsEmailOpt = Joi.string().email({ tlds: { allow: false } }).trim().allow('', null).optional().max(100).label("Email");
export const IsString = Joi.string().required().trim();
export const IsStringOptional = Joi.string().optional().allow(null, '').trim();
export const IsNumber = Joi.number().required();
export const IsNumberOptional = Joi.number().optional().allow(null, '');
export const IsBoolean = Joi.boolean().required();
export const IsStringOpt = Joi.string().optional().allow('', null).trim();
export const IsUrl = Joi.string().uri().trim();
