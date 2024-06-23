import { settings } from "#settings";
import { EmbedBuilder } from "discord.js";
export function Embed(interaction) {
    const UserPicture = interaction.user.displayAvatarURL();
    const UserName = interaction.user.displayName;
    const Embed = new EmbedBuilder()
        .setAuthor({ name: UserName, iconURL: UserPicture })
        .setThumbnail(UserPicture)
        .setColor(settings.colors.caramel)
        .setFooter({ text: `JhulyBot ${settings.version}`, iconURL: UserPicture })
        .setTimestamp(Date.now());
    return Embed;
}
