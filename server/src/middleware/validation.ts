import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateSendSMS = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .required()
      .messages({
        'string.pattern.base': 'Please enter a valid phone number',
        'any.required': 'Phone number is required'
      })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({
      success: false,
      message: error.details[0].message
    });
    return;
  }

  next();
};