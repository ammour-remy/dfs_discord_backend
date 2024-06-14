import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServeurDocument = Serveur & Document;

@Schema()
export class Serveur {
  @Prop({ required: true, minlength: 3, maxlength: 50 })
  nom: string;

  @Prop({ maxlength: 100 })
  description: string;

  @Prop()
  urlLogo: string;

  @Prop()
  public: boolean;

  @Prop({ type: [{ id: Number, name: String }], _id: false }) 
  salons: { id: number; name: string }[];

  @Prop({ type: [{ salonId: Number, content: String, userId: String, email: String, urlAvatar: String }] }) 
  messages: { salonId: number; content: string; userId: string; email: string; urlAvatar: string }[];

  @Prop({ type: [String], default: [] })
  blacklist: string[];
}

export const ServeurSchema = SchemaFactory.createForClass(Serveur);
