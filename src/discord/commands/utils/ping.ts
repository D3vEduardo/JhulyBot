import { Command } from "#base";
import { database } from "#database";
import { Embed, inCooldown, CustomDeferReply } from "#functions";
import { settings } from "#settings";
import { ApplicationCommandType } from "discord.js";

new Command({
  name: "ping",
  description: "Veja o tempo de resposta do bot.",
  dmPermission: true,
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {

    if ( await inCooldown(interaction) === true ) return;

    await CustomDeferReply(interaction);

    const after = Date.now();
    await database.read(interaction.user.id);
    const before = Date.now();
    const databasePing = before - after;
    const botPing = interaction.client.ws.ping;
        await interaction.editReply({
          embeds: [
            Embed(interaction)
              .setTitle(`${settings.emojis.ping} Pong!`)
              .setDescription(`${settings.emojis.bot} Ping do bot: \`${botPing}ms\`.\n${settings.emojis.db} Ping da database: \`${databasePing}ms\``),
          ],
        });
  },
});
