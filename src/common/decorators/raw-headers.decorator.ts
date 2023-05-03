import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const RawHeaders = createParamDecorator((data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.rawHeaders
})