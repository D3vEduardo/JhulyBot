import { Cooldown, Store } from "#base";
import {
  ButtonInteraction,
  CacheType,
  ChatInputCommandInteraction,
  ColorResolvable,
  ModalMessageModalSubmitInteraction,
  SelectMenuInteraction,
  time,
} from "discord.js";
import { Embed } from "#functions";
import { settings } from "#settings";

const cooldowns = new Store<Date>();

export async function inCooldown(
  interaction:
    | ChatInputCommandInteraction<CacheType>
    | SelectMenuInteraction
    | ButtonInteraction<CacheType>
    | ModalMessageModalSubmitInteraction<"cached">
): Promise<Boolean> {
  const cooldown = new Cooldown();
  const CooldownOfUser = cooldowns.get(`${interaction.type}_${interaction.user.id}`);
  if (CooldownOfUser && CooldownOfUser > new Date()) {
    await interaction.reply({
      embeds: [
        Embed(interaction)
          .setDescription(
            `${settings.emojis.error} ${interaction.user}, você está em cooldown! Tente novamente ${time(
              CooldownOfUser,
              "R"
            )}.`
          )
          .setColor(settings.colors.danger as ColorResolvable),
      ],
    });

    return true;
  }

  cooldown.add(6, "seconds");
  cooldowns.set(`${interaction.type}_${interaction.user.id}`, cooldown.expiresAt, {time: cooldown.expiresAt.getTime()-new Date().getTime()});

  return false;
}
