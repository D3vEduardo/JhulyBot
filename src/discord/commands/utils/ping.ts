import { Command } from "#base";
import { db } from "#database";
import { settings } from "#settings";
import {
  ApplicationCommandType,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";

new Command({
  name: "ping",
  description: "Veja o tempo de resposta do bot.",
  dmPermission: true,
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    const start = Date.now();
    await db.users.findOne({});
    const mongoPing = Date.now() - start;
    const botPing = interaction.client.ws.ping;
    const embed: EmbedBuilder = new EmbedBuilder();

    embed
    .setTitle(`${settings.emojis.ping} Pong!`)
      .setDescription(
        `${settings.emojis.bot} Ping do bot: \`${botPing}ms\`.\n${settings.emojis.db} Ping da databse: \`${mongoPing}ms\`.`
      )
      .setColor(settings.colors.caramel as ColorResolvable);

    await interaction.reply({ embeds: [embed] });
  },
});
