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
export const IsContent = Joi.object({
    content: Joi.object({
        content: Joi.array()
            .items(
                Joi.alternatives().try(
                    // Image node
                    Joi.object({
                        type: Joi.string().valid('image').required(),
                        attrs: Joi.object({
                            src: Joi.string().required(),
                            alt: Joi.string().optional().allow(null),
                            title: Joi.string().optional().allow(null),
                            width: Joi.number().optional().allow(null),
                            height: Joi.number().optional().allow(null)
                        }).required()
                    }),
                    // Heading node
                    Joi.object({
                        type: Joi.string().valid('heading').required(),
                        attrs: Joi.object({
                            level: Joi.number().valid(1, 2, 3, 4, 5, 6).required()
                        }).required(),
                        content: Joi.array().items(Joi.object()).optional()
                    }),
                    // Horizontal rule
                    Joi.object({
                        type: Joi.string().valid('horizontalRule').required()
                    }),
                    // Hard break
                    Joi.object({
                        type: Joi.string().valid('hardBreak').required()
                    }),
                    // Block nodes (paragraph, blockquote, codeBlock)
                    Joi.object({
                        type: Joi.string().valid('paragraph', 'blockquote', 'codeBlock').required(),
                        content: Joi.array().items(Joi.object()).optional()
                    }),
                    // List nodes
                    Joi.object({
                        type: Joi.string().valid('bulletList', 'orderedList').required(),
                        content: Joi.array().items(Joi.object()).optional()
                    }),
                    // List item
                    Joi.object({
                        type: Joi.string().valid('listItem').required(),
                        content: Joi.array().items(Joi.object()).optional()
                    }),
                    // Text nodes (inline content)
                    Joi.object({
                        type: Joi.string().valid('text').required(),
                        text: Joi.string().required(),
                        marks: Joi.array().items(
                            Joi.object({
                                type: Joi.string().valid('bold', 'italic', 'strike', 'code').required()
                            })
                        ).optional()
                    }),
                    // Fallback for any other node type
                    Joi.object({
                        type: Joi.string().required(),
                        content: Joi.array().items(Joi.object()).optional(),
                        attrs: Joi.object().optional(),
                        marks: Joi.array().items(Joi.object()).optional(),
                        text: Joi.string().optional()
                    })
                )
            ).min(1).custom((arr, helpers) => {
                // Check if at least one item has meaningful content
                const hasContent = arr.some((node: any) => {
                    // Self-closing nodes (image, horizontalRule, hardBreak)
                    if (['image', 'horizontalRule', 'hardBreak'].includes(node.type)) {
                        return true;
                    }

                    // Text nodes
                    if (node.type === 'text' && node.text && node.text.trim()) {
                        return true;
                    }

                    // Block nodes with content
                    if (Array.isArray(node.content) && node.content.length > 0) {
                        // Recursively check nested content
                        return node.content.some((child: any) => {
                            if (child.type === 'text' && child.text && child.text.trim()) {
                                return true;
                            }
                            if (['image', 'horizontalRule', 'hardBreak'].includes(child.type)) {
                                return true;
                            }
                            return Array.isArray(child.content) && child.content.length > 0;
                        });
                    }

                    return false;
                });

                if (!hasContent) {
                    return helpers.error('any.custom', { message: 'Minimal satu paragraf harus berisi konten' });
                }
                return arr;
            }, 'Setidaknya satu konten bermakna')
            .messages({
                'array.min': 'Konten tidak boleh kosong',
                'any.custom': 'Minimal satu paragraf harus berisi konten',
            }),
        type: Joi.string().required(),
    }).required(),
}).required();
