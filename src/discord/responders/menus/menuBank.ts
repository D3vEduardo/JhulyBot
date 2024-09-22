import { Responder, ResponderType } from "#base";
import { inCooldown } from "#functions";
import { ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

new Responder({
    customId: "MenuBank",
    type: ResponderType.StringSelect, cache: "cached",
    async run(interaction) {
        if ( await inCooldown(interaction) ) return;

        const actionSelected = interaction.values[0];
        let modal;

        switch (actionSelected) {
            case "SendPix":

            modal = new ModalBuilder({
                customId: "ModalPix",
                title: "JhulyBank - Transferência pix",
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            new TextInputBuilder({
                                customId: "UserPix",
                                label: "Digite a chave pix do user:",
                                placeholder: "Digite aqui a chave pix do user...",
                                style: TextInputStyle.Short,
                                required: true,
                            })
                        ]
                    },{
                        type: ComponentType.ActionRow,
                        components: [
                            new TextInputBuilder({
                                customId: "ValuePix",
                                label: "Digite o valor do pix no campo abaixo:",
                                placeholder: "Digite aqui o valor do pix...",
                                style: TextInputStyle.Short,
                                required: true,
                            })
                        ]
                    }
                ]
            });

                break;
            case "Depositar":

            modal = new ModalBuilder({
                customId: "ModalDepósitar",
                title: "JhulyBank - Depósito",
                components: [{
                    type: ComponentType.ActionRow,
                    components: [new TextInputBuilder({
                        customId: "ValueDepositar",
                        label: "Digite o valor do depósito:",
                        placeholder: "Digite aqui o valor do depósito...",
                        style: TextInputStyle.Short,
                        required: true
                    })]
            }]
            });

                break;
            case "Sacar":

            modal = new ModalBuilder({
                customId: "ModalSacar",
                title: "JhulyBank - Saque",
                components: [{
                    type: ComponentType.ActionRow,
                    components: [new TextInputBuilder({
                        customId: "ValueSaque",
                        label: "Digite o valor do saque:",
                        placeholder: "Digite aqui o valor do saque...",
                        style: TextInputStyle.Short,
                        required: true
                    })]
            }]
            });

                break;
        }

        await interaction.showModal(modal as ModalBuilder);

    },
});

