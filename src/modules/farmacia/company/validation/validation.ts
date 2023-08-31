import { injectable } from "tsyringe";
import { ICompanyDTO } from "../dto/company.dto";
import joi from "joi";
import { BaseError } from "@errors/Base";

@injectable()
export class CompanyValidation {
  async validation (numbers: number,) : Promise<void>{}
  async validationCompany(data: ICompanyDTO): Promise<void> {
    try {
      const schema = joi.object({
        name: joi.string().required(),
        email: joi
          .string()
          .required()
          .email({
            minDomainSegments: 3,
            tlds: { allow: ["com", "net", "ru"] },
          }),
        telefone: joi.string().required().min(9).max(12),
        endereco: joi.string().required().min(20).max(50),
        nif: joi.string().required().min(18).max(18),
        userId: joi.number().required(),
      });
      await schema.validateAsync({
        name: data.name,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        nif: data.nif,
        userId: data.userId,
      });
    } catch (error) {
      throw new BaseError(error.message, error.stack, "", 400);
    }
  }
}
