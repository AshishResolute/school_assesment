export class AppError extends Error{
    constructor(message,statusCode,internalMessage)
    {
        super(message);
        this.statusCode=statusCode;
        this.internalMessage=internalMessage;
    }
}