import { Command } from "#base";
import { db } from "#database";
import { CalcSaúdeFinanceira, Embed, FormatSaldo } from "#functions";
import { settings } from "#settings";
import { ApplicationCommandOptionType, ApplicationCommandType, User } from "discord.js";

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
        const Author: User = interaction.user;
        const AuthorDb = await db.users.get(Author.id);
        const embed = Embed(interaction).setTitle(`${settings.emojis.banco} JhulyBank`)
        .setDescription(`Olá **${Author.displayName}**!`)
        .setFields([
            {
                name: `${settings.emojis.cifrão} Saldo:`,
                value: `\`\`\`${FormatSaldo(AuthorDb.saldo!.bank)}\`\`\``,
                inline: true
            }, {
                name: `${settings.emojis.pix} Chave pix:`,
                value: `\`\`\`${Author.id}\`\`\``,
                inline: true
            }, {
                name: `${settings.emojis.sf} Sáude financeira:`,
                value: `\`\`\`${CalcSaúdeFinanceira(AuthorDb.saldo!.bank)}\`\`\``,
                inline: true
            }
        ]);

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
});