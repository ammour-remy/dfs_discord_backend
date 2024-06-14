import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Serveur } from 'src/serveur/serveur.schema';

export type UtilisateurDocument = Utilisateur & Document;

@Schema()
export class Utilisateur {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  urlAvatar: string;

  @Prop()
  serveurs: Serveur[];

  @Prop({ type: [{ salonId: Number, content: String, userId: String, email: String, urlAvatar: String }] })
  messages: { salonId: number; content: string; userId: string; email: string; urlAvatar: string }[];

  @Prop({ type: [String] })
  blacklist: string[];
}

export const UtilisateurSchema = SchemaFactory.createForClass(Utilisateur);
