import {
	ActionRowBuilder,
	SlashCommandBuilder,
	EmbedBuilder,
    EmbedAssertions,
} from 'discord.js';

export const informaton = {
    name: 'rune',
    description: 'Gets the information for a rune / rune tree from the wiki'
};

export default {
    data: new SlashCommandBuilder()
            .setName(`${informaton.name}`)
            .setDescription(`${informaton.description}`)
            .addStringOption((option) => {
                option.setName('rune')
                      .setDescription('Rune / Rune tree Name')
                      .setRequired(true)      
                return option;
            })
    , async execute (interaction, channel) {
        let givenRune = interaction.options.getString('rune');
        givenRune = givenRune.toLowerCase().replace(/([^a-z])/g, '');

        let rtnEmbeds = [];
        let embed = new EmbedBuilder();

        await interaction.deferReply();

        try {
        const runeReq = await fetch('http://ddragon.leagueoflegends.com/cdn/12.21.1/data/en_US/runesReforged.json')
        .catch(err => {
            embed.setTitle('**Error getting rune or rune tree**');
            rtnEmbeds.push(embed);
            interaction.editReply({embeds: rtnEmbeds});
            return;
        });

        const runes = await runeReq.json();
        let tree = runes.find(t => t.name.toLowerCase().replace(/([^a-z])/g, '') === givenRune);
        if (tree !== undefined) {
            embed.setTitle(tree.name);
            embed.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/img/${tree.icon}`);
            rtnEmbeds.push(embed);
            interaction.editReply({embeds: rtnEmbeds});
            return;
        }

        let rune;
        runes.forEach(t => {
            t.slots.forEach(s => {
                s.runes.forEach(r => {
                    if (r.name.toLowerCase().replace(/([^a-z])/g, '') === givenRune) {
                        rune = r;
                        tree = t;
                    }
                });
            });
        });

        if ( rune !== undefined) {
            embed.setTitle(rune.name);
            embed.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`);
            embed.setDescription(rune.shortDesc);
            rtnEmbeds.push(embed);
            interaction.editReply({embeds: rtnEmbeds});
            return;
        }

        embed.setTitle('**Rune or rune tree not found**');
        rtnEmbeds.push(embed);
        await interaction.editReply({embeds: rtnEmbeds});
        } catch (err) {
            embed.setTitle('**Error getting rune or rune tree**');
            rtnEmbeds.push(embed);
            interaction.editReply({embeds: rtnEmbeds});
            return;
        }
    }
    
};