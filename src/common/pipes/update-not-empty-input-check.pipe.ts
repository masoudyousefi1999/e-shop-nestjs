import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class UpdateNotEmptyPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if(Object.keys(value).length === 0){
            throw new BadRequestException("at least one filed should send for update")
        }
        return value;        
    }
}