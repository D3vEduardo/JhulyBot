import { Schema } from "mongoose";
import { t } from "../utils.js";
export const userSchema = new Schema({
    id: t.string,
    saldo: {
        bank: { type: Number, default: 0 },
        carteira: { type: Number, default: 0 }
    },
    casas: { type: (Array), default: [] },
    carros: { type: (Array), default: [] },
    stats: { type: (Array), default: [] }
}, {
    statics: {
        async get(userId) {
            const query = { id: userId };
            return await this.findOne(query) ?? this.create(query);
        },
        async set(userId, data) {
            const query = { id: userId };
            return await this.findOneAndUpdate(query, data);
        }
    }
});
