import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { IUser } from '@um/modules/users/interfaces/user.interface';

import type { Role } from '@um/common/enums/role.enum';

@Schema({ timestamps: true })
export class User implements IUser {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: Role;

  @Prop({ unique: true })
  email?: string;

  @Prop()
  name?: string;

  @Prop({ type: Object })
  address?: Record<string, any>;

  @Prop()
  comment?: string;

  constructor(
    username: string,
    password: string,
    role: Role,
    email?: string,
    name?: string,
    address?: Record<string, any>,
    comment?: string
  ) {
    this.username = username;
    this.password = password;
    this.role = role;
    this.email = email;
    this.name = name;
    this.address = address;
    this.comment = comment;
  }
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
