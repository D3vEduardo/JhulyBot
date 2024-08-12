import { Command } from "#base";
import { Embed, inCooldown } from "#functions";
import { settings } from "#settings";
import { createRow } from "@magicyan/discord";
import { ApplicationCommandType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
new Command({
    name: "apostar",
    description: "Aposte para tentar ganhar JhulyBucks.",
    type: ApplicationCommandType.ChatInput,
    dmPermission: true,
    async run(interaction) {
        if (await inCooldown(interaction))
            return;
        const embed = Embed(interaction)
            .setTitle(`${settings.emojis.bet} JhulyBet`)
            .setDescription(`${interaction.user}, escolha um **jogo** para __apostar__:`);
        const row = createRow(new StringSelectMenuBuilder()
            .setCustomId("MenuApostar")
            .addOptions([
            new StringSelectMenuOptionBuilder()
                .setLabel("Dados")
                .setDescription("Tente tirar um número maior que o da máquina.")
                .setEmoji(settings.emojis.betdado)
                .setValue("Dados")
        ]));
        await interaction.reply({ embeds: [embed], components: [row] });
    }
});
