import { Responder, ResponderType } from "#base";
import { database } from "#database";
import { Embed, FormatSaldo, inCooldown } from "#functions";
import { settings } from "#settings";
import { codeBlock, ColorResolvable, ModalMessageModalSubmitInteraction } from "discord.js";

const { confete1, confete2, betdado, error } = settings.emojis;

const apostas = {
    Dados
};

new Responder({
    customId: "ModalApostar/:ApostaType",
    type: ResponderType.ModalComponent, cache: "cached",
    async run(interaction, { ApostaType }) {

        if ( await inCooldown(interaction) ) return;

        const valueAposta: number = Number(interaction.fields.getTextInputValue("ValueAposta"));
        const author = interaction.user;
        const authorData = await database.read(author.id);
        if ( valueAposta <= 0 || isNaN(valueAposta) ) {
            await interaction.reply({
                embeds: [
                    Embed(interaction).setDescription(`${error} ${author}, informe um __valor__ númerico maior que **zero**.`)
                ]
            });
            return;
        }

       

        if ( authorData.userDetails.saldo.bank < valueAposta ) {
            await interaction.reply({
                embeds: [
                    Embed(interaction)
                    .setDescription(`${error} ${author}, você __não__ possui \`${FormatSaldo(valueAposta)}\` em sua **conta** JhulyBank.`)
                ]
            }); // ! ==> Fechamento do reply

            return;
        }

        await apostas[ApostaType as keyof typeof apostas](interaction);

    },
});

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function Dados(interaction: ModalMessageModalSubmitInteraction<"cached">) {
    const author = interaction.user;
    const authorData = await database.read(author.id);
    const valueAposta = Number(interaction.fields.getTextInputValue("ValueAposta"));

    let dados = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1,];

    await interaction.reply({ embeds: [Embed(interaction).setDescription("Sorteando o seu dado...").setColor(settings.colors.magic as ColorResolvable)] });

    await delay(Math.floor(Math.random()*5000)+1);

    await interaction.editReply({ embeds: [Embed(interaction).setDescription("Sorteando o dado da máquina...").setColor(settings.colors.bravery as ColorResolvable)] });

    await delay(Math.floor(Math.random()*5000)+1);

    while ( dados[0] == dados[1] ) dados = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1,];

    if ( dados[0] > dados[1] ) {

        authorData.userDetails.saldo.bank += valueAposta;
        await database.write(author.id, authorData);

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
            ]// ! ==> Fechamento do embeds
        }); // ! ==> Fechamento no reply

        return;
    }

    authorData.userDetails.saldo.bank -= valueAposta;
        await database.write(author.id, authorData);

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
            ]// ! ==> Fechamento do embeds
        }); // ! ==> Fechamento no reply
}