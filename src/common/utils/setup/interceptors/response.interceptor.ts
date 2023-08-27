import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
export declare const ResponseMessageKey: unique symbol;
export declare const ResponseMessage: (message: string) => import("@nestjs/common").CustomDecorator<typeof ResponseMessageKey>;
export interface Response<T> {
    data: T;
}
export declare class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    private readonly reflector;
    constructor();
    intercept(context: ExecutionContext, next: CallHandler): any;
}
