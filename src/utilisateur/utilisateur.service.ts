import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Utilisateur, UtilisateurDocument } from './utilisateur.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilisateurService {
  constructor(
    @InjectModel(Utilisateur.name)
    private utilisateurModel: Model<UtilisateurDocument>,
  ) { }

  async getByEmailAndClearPassword(
    email: string,
    clearPassword: string,
  ): Promise<Utilisateur> {
    const utilisateur = await this.utilisateurModel.findOne({ email: email });

    if (utilisateur && bcrypt.compare(clearPassword, utilisateur.password)) {
      return utilisateur;
    }

    return null;
  }

  async create(createdUtilisateurDto: any): Promise<Utilisateur> {
    const createdUtilisateur = new this.utilisateurModel(createdUtilisateurDto);

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createdUtilisateur.password, saltOrRounds);
    createdUtilisateur.password = hash;

    return createdUtilisateur.save();
  }

  async findAll(): Promise<Utilisateur[]> {
    return this.utilisateurModel.find().exec();
  }

  async rejoindreServeur(
    email: string,
    idServeurArejoindre: number,
  ): Promise<Utilisateur> {
    const utilisateur = await this.utilisateurModel.findOneAndUpdate(
      { email: email },
      { $addToSet: { serveurs: idServeurArejoindre } },
      { new: true },
    );

    return utilisateur;
  }

  async getByEmail(email: string): Promise<Utilisateur> {
    return this.utilisateurModel.findOne({ email });
  }
}
