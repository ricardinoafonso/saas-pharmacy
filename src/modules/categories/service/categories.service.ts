import { injectable } from 'tsyringe';
import { Categories, ICategories } from '../dto/categories.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '@shared/infra/database/database';
@injectable()
export class CategoriesServices implements ICategories {
    private CategorieRepository: PrismaClient
    constructor(){
        this.CategorieRepository = prisma
    }
    create(data: Categories): Promise<Categories> {
        return this.CategorieRepository.categorie.create({data: {...data}})
    }
    delete(id: number): Promise<Prisma.BatchPayload> {
        throw new Error('Method not implemented.');
    }
    update(id: number, data: Categories): Promise<Categories> {
        throw new Error('Method not implemented.');
    }
    findOne(id: number): Promise<Categories> {
        throw new Error('Method not implemented.');
    }
    findAll(page?: number, sort?: Prisma.salesAvgOrderByAggregateInput): Promise<Categories[]> {
        throw new Error('Method not implemented.');
    }
}