import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export interface iBadges {
    name: string;
    emoji: string;
    src: string;
}

export interface iStatus {
    data: string;
    expire: number;
    name: "job" | "daily";
}
export interface iUser {
    id: string;
    userDetails: {
        saldo: {
            bank: number | 0;
            carteira: number | 0;
        },
        badges: Array<iBadges> | [];
        status: Array<iStatus> | [];
    }
}

function MapUser(data: any): iUser["userDetails"] {
    return {
        saldo: {
            bank: data.saldo?.bank || 0,
            carteira: data.saldo?.carteira || 0
        },
        badges: data.badges || [],
        status: data.status || []
    };
};

async function read(id: string): Promise<iUser> {
    let data: any = await prisma.user.findUnique({ where: { id } });
    if (!data) {
        data = await write(id,{
                userDetails: {
                    saldo: {
                        bank: 0,
                        carteira: 0
                    },
                    badges: [],
                    status: []
                }
            });
    } else {
        data.userDetails = MapUser(data.userDetails);
    }
    return data as iUser;
}

async function write(id: string, data: any): Promise<iUser> {
    return await prisma.user.upsert({
        where: {id},
        update: {userDetails: data.userDetails},
        create: {id, userDetails: data.userDetails}
    }) as iUser;
}

export const database = {
    read,
    write
};
