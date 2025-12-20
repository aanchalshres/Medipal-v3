import { Response } from 'express';

class ApiResponse {
  constructor(private res: Response) {}

  success(status: number = 200, message: string = 'Success', data: any = null) {
    this.res.status(status).json({
      success: true,
      status,
      message,
      data,
    });
  }

  error(status: number = 500, message: string = 'Error', error: any = null) {
    console.error(message, error);
    this.res.status(status).json({
      success: false,
      status,
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
}

export default ApiResponse;