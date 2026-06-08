import { Controller, Post, UploadedFile,  UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config'


@Controller('upload')
export class UploadController {
    constructor(
        private readonly configService: ConfigService
    ) {

    }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
            file: {
                type: 'string',
                format: 'binary',
            },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
            destination: process.env.PATH_UPLOADS || './uploads',
            filename: (req, file, cb) => {
                const name = Date.now() + '-' + file.originalname;
                cb(null, name);
            },
            }),
        }),
        )
        upload(@UploadedFile() file: Express.Multer.File) {
        return {
            message: 'File caricato correttamente',
            filename: file.filename,
            path: file.path,
        };
    }
}
