import { Command } from "#base";
import { CalcSaúdeFinanceira, CustomDeferReply, Embed, FormatSaldo, inCooldown } from "#functions";
import { settings } from "#settings";
import { database, iUser } from "#database";
import { ApplicationCommandOptionType, ApplicationCommandType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, User } from "discord.js";
import { createRow } from "@magicyan/discord";

new Command({
    name: "conta",
    description: "Gerencie sua conta bancária.",
    dmPermission: true,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "bancária",
            description: "Gerencie sua conta bancária.",
            type: ApplicationCommandOptionType.Subcommand
        }
    ],
    async run(interaction){
        if ( await inCooldown(interaction) ) return;
        await CustomDeferReply(interaction);
        const Author: User = interaction.user;
        const AuthorDb: iUser = await database.read(interaction.user.id);
        
        const embed = Embed(interaction).setTitle(`${settings.emojis.banco} JhulyBank`)
        .setDescription(`Olá **${Author.displayName}**!`)
        .setFields([
            {
                name: `${settings.emojis.cifrão} Saldo:`,
                value: `\`\`\`${FormatSaldo(AuthorDb!.userDetails.saldo.bank)}\`\`\``,
                inline: true
            }, {
                name: `${settings.emojis.pix} Chave pix:`,
                value: `\`\`\`${Author.id}\`\`\``,
                inline: true
            }, {
                name: `${settings.emojis.sf} Sáude financeira:`,
                value: `\`\`\`${CalcSaúdeFinanceira(AuthorDb!.userDetails.saldo.bank)}\`\`\``,
                inline: true
            }
        ]);

        const row = createRow(
            new StringSelectMenuBuilder()
            .setCustomId("MenuBank")
            .addOptions([
                new StringSelectMenuOptionBuilder()
                .setEmoji(settings.emojis.pix)
                .setLabel("Enviar pix.")
                .setValue("SendPix"),
                new StringSelectMenuOptionBuilder()
                .setEmoji(settings.emojis.depositar)
                .setLabel("Depositar JhulyBucks.")
                .setValue("Depositar"),
                new StringSelectMenuOptionBuilder()
                .setEmoji(settings.emojis.sacar)
                .setLabel("Sacar JhulyBucks.")
                .setValue("Sacar"),
            ])
        );

        await interaction.editReply({ embeds: [embed], components: [row] });
    }
});