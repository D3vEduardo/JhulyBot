import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
function MapUser(data) {
    return {
        saldo: {
            bank: data.saldo?.bank || 0,
            carteira: data.saldo?.carteira || 0
        },
        badges: data.badges || [],
        status: data.status || []
    };
}
;
async function read(id) {
    let data = await prisma.user.findUnique({ where: { id: id } });
    if (!data)
        data = await prisma.user.create({
            data: {
                id: id,
                userDetails: {
                    saldo: {
                        bank: 0,
                        carteira: 0
                    }
                }
            }
        });
    else
        data.userDetails = MapUser(data.userDetails);
    return data;
}
async function write(id, data) {
    let escrito;
    if (await prisma.user.findUnique({ where: { id: id } })) {
        return escrito = await prisma.user.update({
            where: { id: id },
            data: data
        });
    }
    escrito = await prisma.user.create({
        data: {
            id: id,
            userDetails: data.userDetails
        }
    });
    return escrito;
}
export const database = {
    read,
    write
};
