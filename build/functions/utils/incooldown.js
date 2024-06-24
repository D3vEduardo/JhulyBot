import { Cooldown, Store } from "#base";
import { time } from "discord.js";
import { Embed } from "#functions";
import { settings } from "#settings";
;
const cooldowns = new Store();
export async function inCooldown(CustomId, interaction) {
    const timeSeconds = 5;
    const UserCooldown = cooldowns.get(CustomId);
    if (UserCooldown && UserCooldown > new Date()) {
        await interaction.reply({
            embeds: [
                Embed(interaction).setDescription(`Você está em cooldown! Tente novamente ${time(UserCooldown, "R")}`).setColor(settings.colors.danger),
            ],
            ephemeral
        });
        return true;
    }
    const cooldown = new Cooldown();
    cooldown.add(timeSeconds, "seconds");
    cooldowns.set(CustomId, cooldown.expiresAt);
    return false;
}
