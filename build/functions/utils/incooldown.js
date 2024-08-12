import { Cooldown, Store } from "#base";
import { time, } from "discord.js";
import { Embed } from "#functions";
import { settings } from "#settings";
const cooldowns = new Store();
export async function inCooldown(interaction) {
    const cooldown = new Cooldown();
    const CooldownOfUser = cooldowns.get(`${interaction.type}_${interaction.user.id}`);
    if (CooldownOfUser && CooldownOfUser > new Date()) {
        await interaction.reply({
            embeds: [
                Embed(interaction)
                    .setDescription(`${settings.emojis.error} ${interaction.user}, você está em cooldown! Tente novamente ${time(CooldownOfUser, "R")}.`)
                    .setColor(settings.colors.danger),
            ],
        });
        return true;
    }
    cooldown.add(6, "seconds");
    cooldowns.set(`${interaction.type}_${interaction.user.id}`, cooldown.expiresAt, { time: cooldown.expiresAt.getTime() - new Date().getTime() });
    return false;
}
