import { Responder, ResponderType } from "#base";
import { FirebaseCruds } from "#database";
import { Embed, FormatSaldo, inCooldown } from "#functions";
import { settings } from "#settings";
import { codeBlock } from "discord.js";
const { confete1, confete2, betdado, error } = settings.emojis;
const apostas = {
    Dados
};
new Responder({
    customId: "ModalApostar/:ApostaType",
    type: ResponderType.ModalComponent, cache: "cached",
    async run(interaction, { ApostaType }) {
        if (await inCooldown(interaction))
            return;
        const valueAposta = Number(interaction.fields.getTextInputValue("ValueAposta"));
        const author = interaction.user;
        const authorData = await FirebaseCruds.get(`/users/${author.id}`);
        if (authorData.userDetails.saldo.bank < valueAposta) {
            await interaction.reply({
                embeds: [
                    Embed(interaction)
                        .setDescription(`${error} ${author}, você __não__ possui \`${FormatSaldo(valueAposta)}\` em sua **conta** JhulyBank.`)
                ]
            }); // ! ==> Fechamento do reply
            return;
        }
        await apostas[ApostaType](interaction);
    },
});
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function Dados(interaction) {
    const author = interaction.user;
    const authorData = await FirebaseCruds.get(`/users/${author.id}`);
    const valueAposta = Number(interaction.fields.getTextInputValue("ValueAposta"));
    if (valueAposta >= 0) {
        await interaction.reply({
            embeds: [
                Embed(interaction).setDescription(`${error} ${author}, informe um valor maior ou igual a zero.`)
            ]
        });
        return;
    }
    let dados = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1,];
    await interaction.reply({ embeds: [Embed(interaction).setDescription("Sorteando o seu dado...").setColor(settings.colors.magic)] });
    await delay(Math.floor(Math.random() * 5000) + 1);
    await interaction.editReply({ embeds: [Embed(interaction).setDescription("Sorteando o dado da máquina...").setColor(settings.colors.bravery)] });
    await delay(Math.floor(Math.random() * 5000) + 1);
    while (dados[0] == dados[1])
        dados = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1,];
    if (dados[0] > dados[1]) {
        authorData.userDetails.saldo.bank += valueAposta;
        await FirebaseCruds.set(`/users/${author.id}`, authorData);
        await interaction.editReply({
            embeds: [
                Embed(interaction)
                    .setTitle(`${betdado} JhulyBet - Dados`)
                    .setDescription(`${author}, você __apostou__ \`${FormatSaldo(valueAposta)}\` nos dados e **ganhou**. ${confete1}${confete2}`)
                    .setFields([
                    {
                        name: `${settings.emojis.betdado} Você tirou:`,
                        value: codeBlock(`${dados[0]}`),
                        inline: true
                    },
                    {
                        name: `${settings.emojis.betdado} A máquina tirou:`,
                        value: codeBlock(`${dados[1]}`),
                        inline: true
                    }
                ])
            ] // ! ==> Fechamento do embeds
        }); // ! ==> Fechamento no reply
        return;
    }
    authorData.userDetails.saldo.bank -= valueAposta;
    await FirebaseCruds.set(`/users/${author.id}`, authorData);
    await interaction.editReply({
        embeds: [
            Embed(interaction)
                .setTitle(`${betdado} JhulyBet - Dados`)
                .setDescription(`${author}, você __apostou__ \`${FormatSaldo(valueAposta)}\` nos dados e **perdeu**. :cry::sob:`)
                .setFields([
                {
                    name: `${settings.emojis.betdado} Você tirou:`,
                    value: codeBlock(`${dados[0]}`),
                    inline: true
                },
                {
                    name: `${settings.emojis.betdado} A máquina tirou:`,
                    value: codeBlock(`${dados[1]}`),
                    inline: true
                }
            ])
        ] // ! ==> Fechamento do embeds
    }); // ! ==> Fechamento no reply
}
