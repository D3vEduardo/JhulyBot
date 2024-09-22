import { Responder, ResponderType } from "#base";
import { inCooldown } from "#functions";
import { ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

new Responder({
    customId: "MenuApostar",
    type: ResponderType.StringSelect, cache: "cached",
    async run(interaction) {
        if ( await inCooldown(interaction) ) return;
        const aposta = interaction.values[0];

        const modal = new ModalBuilder({
            customId: `ModalApostar/${aposta}`,
            title: "Agora nos informe quanto quer apostar.",
            components: [{
                type: ComponentType.ActionRow,
                components: [new TextInputBuilder({
                    customId: "ValueAposta",
                    placeholder: "Digite aqui o valor da aposta...",
                    label: "Informe o valor da aposta:",
                    required: true,
                    style: TextInputStyle.Short
                })] // ! ==> Fechamento do components do components
            }] // ! ==> Fechamento do components do ModalBuilder
        }); // ! ==> Fechamento do ModalBuilder

        await interaction.showModal(modal);
    },
});