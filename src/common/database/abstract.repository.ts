import {
  FilterQuery,
  Model,
  QuerySelector,
  Types,
  UpdateQuery,
} from 'mongoose';
import { AbstractEntity } from './abstract.entity';
import {
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Role } from 'src/user/user-role.enum';

type filterQueryOperator<T> = { $or: Array<FilterQuery<T>> };

export abstract class AbstractRepository<T extends AbstractEntity> {
  constructor(private readonly model: Model<T>) {}

  notFoundError(message?: string): Error {
    throw new NotFoundException(message);
  }

  internalError(message?: string): Error {
    throw new InternalServerErrorException(message);
  }

  async findAllDocuments(): Promise<T[]> {
    try {
      const fundedDocuments = await this.model
        .find({})
        .lean<T[]>()
        .exec();
      if (!fundedDocuments) {
        this.notFoundError('document not found');
        return;
      }
      return fundedDocuments;
    } catch (error) {
      console.log('error happend on finding all documents => ', error);
      this.internalError(`database error : ${error}`);
      return;
    }
  }

  async findDocumentsByQuery(
    filterQuery: FilterQuery<T>,
    select?: QuerySelector<T>,
  ): Promise<T[]> {
    try {
      const fundedDocuments = await this.model
        .find({ ...filterQuery })
        .select(select)
        .lean<T[]>()
        .exec();
      if (!fundedDocuments) {
        this.notFoundError(
          `document with notfound with query : ${filterQuery}`,
        );
        return;
      }
      return fundedDocuments;
    } catch (error) {
      console.log('error happend on finding all documents => ', error);
      this.internalError(`database error : ${error}`);
      return;
    }
  }

  async createDocument(document: Omit<T, '_id'>): Promise<T> {
    try {
      const newDocument = (
        await this.model.create({ ...document, _id: new Types.ObjectId() })
      ).toJSON() as T;
      if (!newDocument) {
        this.internalError('cant create document');
        return;
      }
      return newDocument;
    } catch (error) {
      // checking for duplicate field error
      if (error.code === 11000) {
        // getting duplicated field and sending it to client
        throw new UnprocessableEntityException(
          `${Object.keys(error.keyPattern)[0]} is already exsist please use another one`,
        );
      }
      this.internalError(`database error : ${error}`);
      return;
    }
  }

  async findOneDocument(
    _id: Types.ObjectId,
    select?: QuerySelector<T>,
  ): Promise<T> {
    try {
      const fundedDocument = await this.model
        .findOne({ _id })
        .select(select)
        .lean<T>()
        .exec();
      if (!fundedDocument) {
        this.notFoundError(`cant find document with id : ${_id}`);
        return;
      }
      return fundedDocument;
    } catch (error) {
      this.internalError(`database error : ${error}`);
      return;
    }
  }

  async updateDocument(
    _id: Types.ObjectId,
    updateQuery: UpdateQuery<T>,
    select?: QuerySelector<T>,
  ): Promise<T> {
    try {
      const updatedDocument = await this.model
        .findOneAndUpdate({ _id }, { $set: updateQuery }, { new: true })
        .select(select)
        .lean<T>()
        .exec();

      if (!updatedDocument) {
        this.notFoundError(`cant find and update document with id : ${_id}`);
        return;
      }

      return updatedDocument;
    } catch (error) {
      this.internalError(`databse error : ${error}`);
      return;
    }
  }

  async deleteDocument(_id: Types.ObjectId): Promise<T> {
    try {
      const deletedDocument = await this.model
        .findOneAndDelete({ _id })
        .lean<T>()
        .exec();
      if (!deletedDocument) {
        this.notFoundError(`cant delete document with id : ${_id}`);
        return;
      }

      return deletedDocument;
    } catch (error) {
      this.internalError(`database error : ${error}`);
      return;
    }
  }

  async findWithOrQuery(filterQuery: Array<FilterQuery<T>>,select? : QuerySelector<T>) : Promise<T> {
    try {
      const document = await this.model.findOne({ $or: filterQuery }).select(select).lean<T>().exec();
      if (!document) {
        this.notFoundError('document not found');
      }
      return document;
    } catch (error) {
      this.internalError(`database error : ${error}`);
    }
  }
}
