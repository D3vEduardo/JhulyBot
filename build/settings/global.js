import { join } from "node:path";
Object.assign(globalThis, {
    animated: true,
    fetchReply: true,
    ephemeral: true,
    required: true,
    inline: true,
    disabled: true,
    __rootname: process.cwd(),
    rootTo(...path) {
        return join(process.cwd(), ...path);
    }
});
