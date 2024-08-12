import { log } from "#settings";
import { spaceBuilder } from "@magicyan/discord";
import ck from "chalk";
import { Collection } from "discord.js";
import { getCustomIdParams } from "./utils/Params.js";
export var ResponderType;
(function (ResponderType) {
    ResponderType["Row"] = "Row";
    ResponderType["Modal"] = "Modal";
    ResponderType["ModalComponent"] = "Modal component";
    ResponderType["Button"] = "Button";
    ResponderType["Select"] = "Select menu";
    ResponderType["StringSelect"] = "String select menu";
    ResponderType["UserSelect"] = "User select menu";
    ResponderType["RoleSelect"] = "Role select menu";
    ResponderType["ChannelSelect"] = "Channel select menu";
    ResponderType["MentionableSelect"] = "Mentionable select menu";
    ResponderType["All"] = "Component or modal";
})(ResponderType || (ResponderType = {}));
export class Responder {
    static items = new Collection();
    constructor(data) {
        const subitems = Responder.items.get(data.type) ?? new Collection();
        subitems.set(data.customId, data);
        Responder.items.set(data.type, subitems);
    }
    static loadLogs() {
        for (const subitems of Responder.items.values()) {
            for (const { customId, type } of subitems.values()) {
                const text = spaceBuilder(ck.greenBright.underline(type), ck.blue.underline(customId), "responder loaded!");
                log.success(ck.green(text));
            }
        }
    }
    static sortCustomIds() {
        function hasParam(customId) {
            return customId.split("/").some(segment => segment.startsWith(":"));
        }
        function count(customId) {
            return customId.split("/").length;
        }
        function compareRoutes([customIdA], [customIdB]) {
            const hasParamA = hasParam(customIdA);
            const hasParamB = hasParam(customIdB);
            if (hasParamA && !hasParamB) {
                return 1;
            }
            else if (!hasParamA && hasParamB) {
                return -1;
            }
            return count(customIdA) - count(customIdB);
        }
        for (const [type, subItems] of Responder.items) {
            const entries = Array.from(subItems.entries());
            entries.sort(compareRoutes);
            Responder.items.set(type, new Collection(entries));
        }
    }
    static getResponderType(interaction) {
        return interaction.isButton() ? ResponderType.Button :
            interaction.isStringSelectMenu() ? ResponderType.StringSelect :
                interaction.isChannelSelectMenu() ? ResponderType.ChannelSelect :
                    interaction.isRoleSelectMenu() ? ResponderType.RoleSelect :
                        interaction.isUserSelectMenu() ? ResponderType.UserSelect :
                            interaction.isMentionableSelectMenu() ? ResponderType.MentionableSelect :
                                interaction.isFromMessage() ? ResponderType.ModalComponent :
                                    interaction.isModalSubmit() ? ResponderType.Modal : undefined;
    }
    static onInteraction(interaction) {
        const { customId } = interaction;
        const responderType = Responder.getResponderType(interaction);
        if (!responderType)
            return;
        const findSubItems = (type) => {
            if (type === ResponderType.All)
                return Responder.items.get(ResponderType.All);
            if (interaction.isAnySelectMenu()) {
                if (type !== ResponderType.Select && type !== ResponderType.Row) {
                    return Responder.items.get(ResponderType.Select) ?? findSubItems(ResponderType.Select);
                }
                if (type === ResponderType.Select) {
                    return Responder.items.get(ResponderType.Row) ?? findSubItems(ResponderType.Row);
                }
            }
            if (interaction.isButton()) {
                if (type !== ResponderType.Row) {
                    return Responder.items.get(ResponderType.Row) ?? findSubItems(ResponderType.All);
                }
            }
            return findSubItems(ResponderType.All);
        };
        const findAndRun = (subItems, type) => {
            if (!subItems)
                return;
            const responder = subItems.get(customId) ?? subItems.find(data => !!getCustomIdParams(data.customId, customId));
            if (responder) {
                const params = getCustomIdParams(responder.customId, customId) ?? {};
                responder.run(interaction, params);
                return;
            }
            if (type === ResponderType.All)
                return;
            if (interaction.isAnySelectMenu()) {
                if (type !== ResponderType.Select && type !== ResponderType.Row) {
                    findAndRun(findSubItems(type), ResponderType.Select);
                    return;
                }
                if (type === ResponderType.Select) {
                    findAndRun(findSubItems(ResponderType.Select), ResponderType.Row);
                    return;
                }
                findAndRun(findSubItems(ResponderType.Row), ResponderType.All);
                return;
            }
            if (interaction.isButton()) {
                if (type !== ResponderType.Row) {
                    findAndRun(findSubItems(type), ResponderType.Row);
                    return;
                }
                findAndRun(findSubItems(ResponderType.Row), ResponderType.All);
                return;
            }
            findAndRun(findSubItems(ResponderType.All), ResponderType.All);
        };
        const subItems = Responder.items.get(responderType) ?? findSubItems(responderType);
        if (!subItems)
            return;
        findAndRun(subItems, responderType);
    }
}
