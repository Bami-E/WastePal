import Joi from "joi";

export const updateProfileSchema = Joi.object({
    firstName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    lastName: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    phoneNumber: Joi.string()
      .trim()
      .pattern(/^[0-9]{10,15}$/)
      .optional()
      .messages({
        "string.pattern.base": "Phone number must be between 10 and 15 digits.",
      }),

    businessName: Joi.string()
      .trim()
      .max(150)
      .optional(),

    businessType: Joi.string()
      .trim()
      .max(100)
      .optional(),

    address: Joi.string()
      .trim()
      .max(255)
      .optional(),

    city: Joi.string()
      .trim()
      .max(100)
      .optional(),

    state: Joi.string()
      .trim()
      .max(100)
      .optional(),

    country: Joi.string()
      .trim()
      .max(100)
      .optional(),

    preferredLanguage: Joi.string()
      .trim()
      .max(50)
      .optional(),

    notificationsEnabled: Joi.boolean()
      .optional(),
  }).min(1);
