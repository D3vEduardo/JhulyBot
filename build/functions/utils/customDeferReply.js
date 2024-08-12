import { settings } from "#settings";
import { EmbedBuilder } from "discord.js";
export async function CustomDeferReply(interaction) {
    const embed = new EmbedBuilder()
        .setDescription(`${settings.emojis.spin_loading} Carregando interação...`)
        .setColor(settings.colors.caramel);
    await interaction.reply({ embeds: [embed] });
    return true;
}
