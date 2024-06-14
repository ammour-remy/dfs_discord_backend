// src/cats/cats.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Serveur, ServeurDocument } from './serveur.schema';
import {
  Utilisateur,
  UtilisateurDocument,
} from 'src/utilisateur/utilisateur.schema';

@Injectable()
export class ServeurService {
  constructor(
    @InjectModel(Serveur.name) private serveurModel: Model<ServeurDocument>,
    @InjectModel(Utilisateur.name)
    private utilisateurModel: Model<UtilisateurDocument>,
  ) {}

  async create(createdServeurDto: any): Promise<Serveur> {
    const createdServeur = new this.serveurModel(createdServeurDto);
    return createdServeur.save();
  }

  async findAllPublic(): Promise<Serveur[]> {
    return this.serveurModel.find({ public: true });
  }

  async findAllServerOfUser(email: string): Promise<Serveur[]> {
    const utilisateur = await this.utilisateurModel.findOne({ email });

    const serveurs = await this.serveurModel.find({
      _id: { $in: utilisateur.serveurs },
    });

    return serveurs;
  }
  async addToBlacklist(serverId: string, userId: string): Promise<Serveur> {
    const serveur = await this.serveurModel.findById(serverId);
    if (serveur) {
        if (!serveur.blacklist.includes(userId)) {
            serveur.blacklist.push(userId);
            await serveur.save();
        }
    }
    return serveur;
}


  async addSalon(serverId: string, salonName: string): Promise<Serveur> {
    const serveur = await this.serveurModel.findById(serverId);
    if (serveur) {
      const newId = serveur.salons.length > 0
        ? Math.max(...serveur.salons.map(salon => salon.id || 0)) + 1 : 1;
      serveur.salons.push({ id: newId, name: salonName });
      await serveur.save();
    }
    const updatedServeur = await this.serveurModel.findById(serverId).lean();
    return updatedServeur;
  }
  async addMessage(serverId: string, salonId: number, content: string, userId: string): Promise<Serveur> {
    const serveur = await this.serveurModel.findById(serverId);
    if (serveur) {
      const utilisateur = await this.utilisateurModel.findById(userId);
      if (utilisateur) {
        const newMessage = {
          salonId,
          content,
          userId,
          email: utilisateur.email,
          urlAvatar: utilisateur.urlAvatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXZ6Vw-Br-RRvMstTlTqbeGXw4PNepXRrTzg&s'
        };
        serveur.messages.push(newMessage);
        await serveur.save();
      }
    }
    const updatedServeur = await this.serveurModel.findById(serverId).lean();
    return updatedServeur;
  }
}
