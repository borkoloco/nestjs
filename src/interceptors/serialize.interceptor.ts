import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  //   new (...args: any[]): {};
  new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // //run something you want before the response is handled by req handler
    // console.log('Im running befoire the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        //run something before response is sent
        // console.log('Im running before response is sent', data);
        // return plainToClass(this.dto, data, {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
