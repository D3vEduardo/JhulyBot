import { EmojiResolvable } from "discord.js";
import { jobs } from "#assets";

interface iBagdes {
    emoji: EmojiResolvable;
    name: string;
    src: string;
  }

export interface iStatus {
    name: "job" | "daily";
    expire: number;
    data?: keyof typeof jobs;
}

export interface iUserSchema {
    userDetails: {
        saldo: {
            bank: number;
            carteira: number;
        };
        props: {
            casas: Array<Object>;
            carros: Array<Object>;
        };
        status: Array<iStatus>;
        badges: Array<iBagdes>;
    }
}

export const UserSchema: iUserSchema = {
    userDetails: {
        saldo: {
            bank: 0,
            carteira: 0
        },
        props: {
            casas: [],
            carros: []
        },
        status: [],
        badges: []
    }
};