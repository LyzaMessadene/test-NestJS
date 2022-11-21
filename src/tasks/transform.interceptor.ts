import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(map((data) => classToPlain(data)));
  }
}
// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// export interface Response<T> {
//   data: T;
// }

// @Injectable()
// export class TransformInterceptor<T>
//   implements NestInterceptor<T, Response<T>>
// {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<T>,
//   ): Observable<Response<T>> {
//     return next.handle().pipe(map((data) => ({ data })));
//   }
// }
