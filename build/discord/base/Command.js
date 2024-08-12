import { log } from "#settings";
import { findCommand } from "@magicyan/discord";
import ck from "chalk";
import { ApplicationCommandType, Collection } from "discord.js";
export class Command {
    data;
    static items = new Collection();
    constructor(data) {
        this.data = data;
        data.dmPermission ??= false;
        data.type ??= ApplicationCommandType.ChatInput;
        Command.items.set(data.name, data);
    }
    getApplicationCommand(client) {
        return findCommand(client).byName(this.data.name);
    }
    static async register(addMessage, client, guilds) {
        function plural(value) {
            return (value > 1 && "s") || "";
        }
        if (guilds?.size) {
            const [globalCommands, guildCommads] = Command.items.partition(c => c.global === true);
            await client.application.commands.set(Array.from(globalCommands.values()))
                .then(({ size }) => Boolean(size) &&
                addMessage(`⤿ ${size} command${plural(size)} successfully registered globally!`));
            for (const guild of guilds.values()) {
                await guild.commands.set(Array.from(guildCommads.values()))
                    .then(({ size }) => addMessage(`⤿ ${size} command${plural(size)} registered in ${ck.underline(guild.name)} guild successfully!`));
            }
            return;
        }
        for (const guild of client.guilds.cache.values()) {
            guild.commands.set([]);
        }
        await client.application.commands.set(Array.from(Command.items.values()))
            .then(({ size }) => addMessage(`⤿ ${size} command${plural(size)} successfully registered globally!`));
    }
    static onCommand(interaction) {
        const command = Command.items.get(interaction.commandName);
        if (!command)
            return;
        command.run(interaction);
    }
    static onAutocomplete(interaction) {
        const command = Command.items.get(interaction.commandName);
        if (command && "autocomplete" in command && command.autocomplete) {
            command.autocomplete(interaction);
        }
    }
    static loadLogs() {
        for (const [name] of Command.items) {
            log.success(ck.green(`{/} ${ck.blue.underline(name)} command loaded!`));
        }
    }
}
