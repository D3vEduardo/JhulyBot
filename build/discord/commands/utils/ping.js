import { Command } from "#base";
import { db } from "#database";
import { Embed, inCooldown, CustomDeferReply } from "#functions";
import { settings } from "#settings";
import { ApplicationCommandType } from "discord.js";
import { onValue, ref } from "firebase/database";
new Command({
    name: "ping",
    description: "Veja o tempo de resposta do bot.",
    dmPermission: true,
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        if (await inCooldown(interaction) === true)
            return;
        await CustomDeferReply(interaction);
        const startTime = Date.now();
        const botPing = interaction.client.ws.ping;
        onValue(ref(db), async () => {
            const endTime = Date.now();
            const databasePing = endTime - startTime;
            await interaction.editReply({
                embeds: [
                    Embed(interaction)
                        .setTitle(`${settings.emojis.ping} Pong!`)
                        .setDescription(`${settings.emojis.bot} Ping do bot: \`${botPing}ms\`.\n${settings.emojis.db} Ping da database: \`${databasePing}ms\``),
                ],
            });
        }, { onlyOnce: true });
    },
});
