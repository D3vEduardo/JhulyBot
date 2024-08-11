import { settings } from "#settings";
import { CacheType, ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SelectMenuInteraction, ButtonInteraction, ModalMessageModalSubmitInteraction } from "discord.js";

export async function CustomDeferReply(interaction: ChatInputCommandInteraction<CacheType> | SelectMenuInteraction | ButtonInteraction<CacheType> | ModalMessageModalSubmitInteraction<"cached">) {

    const embed: EmbedBuilder = new EmbedBuilder()
    .setDescription(`${settings.emojis.spin_loading} Carregando interação...`)
    .setColor(settings.colors.caramel as ColorResolvable);

    await interaction.reply({ embeds: [ embed ] });
    return true;
}