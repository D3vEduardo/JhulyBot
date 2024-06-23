import { Schema } from "mongoose";
import { t } from "../utils.js";

export const userSchema = new Schema(
    {
        id: t.string,
        saldo: {
            bank: { type: Number, default: 0 },
            carteira: {type: Number, default: 0}
        },
        casas: { type: Array<Object>, default: [] },
        carros: { type: Array<Object>, default: [] },
        stats: { type: Array<Object>, default: [] }
    },
    {
        statics: {
            async get(userId: string) {
                const query = { id: userId };
                return await this.findOne(query) ?? this.create(query);
            },
            async set(userId: string, data: any) {
                const query = { id: userId };
                return await this.findOneAndUpdate(query, data);
            }
        }
    },
);