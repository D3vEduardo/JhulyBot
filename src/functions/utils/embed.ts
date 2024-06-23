import { settings } from "#settings";
import { ColorResolvable, EmbedBuilder, Interaction } from "discord.js";

export function Embed(interaction: Interaction) {
    const UserPicture = interaction.user.displayAvatarURL();
    const UserName = interaction.user.displayName;
    const Embed: EmbedBuilder = new EmbedBuilder()
    .setAuthor({ name: UserName, iconURL: UserPicture })
    .setThumbnail(UserPicture)
    .setColor(settings.colors.caramel as ColorResolvable)
    .setFooter({ text: `JhulyBot ${settings.version}`, iconURL: UserPicture })
    .setTimestamp(Date.now());

    return Embed;
}