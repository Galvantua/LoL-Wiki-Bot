import {
	ActionRowBuilder,
	SlashCommandBuilder,
	EmbedBuilder,
    EmbedAssertions,
} from 'discord.js';
import { JSDOM } from 'jsdom'

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

        const treeDescriptions = {precision: 'Improved attacks and sustained damage.',
                              domination: 'Burst damage and target access.',
                              sorcery: 'Empowered abilities and resource manipulation.',
                              inspiration: 'Creative tools and rule bending.',
                              resolve: 'Durability and crowd control.'}
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
            const url = `https://leagueoflegends.fandom.com/api.php?action=parse&text={{Rune%20path%20infobox/Resolve}}&contentmodel=wikitext&format=json`;
            const request = await fetch(url).catch(err => {console.log(err);});
            const body = await request.json();
            let dom = new JSDOM(body.parse.text['*'], {contentType: 'text/html'});
            let document = dom.window.document;

            embed.setTitle(tree.name);
            embed.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/img/${tree.icon}`);
            embed.setDescription(`_${treeDescriptions[tree.name.toLowerCase()] || ''}_`)

            let index = 0;
            while (document.getElementsByClassName('pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background')[index] !== undefined && document.getElementsByClassName(`pi-smart-group-body pi-border-color`)[index] !== undefined && document.getElementsByClassName(`pi-smart-group-body pi-border-color`)[index].textContent.trim()) {
                embed.addFields({name: document.getElementsByClassName('pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background')[index].textContent, value: document.getElementsByClassName(`pi-smart-group-body pi-border-color`)[index].textContent.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ', ')})
                index++;
            }

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

        if ( rune !== undefined ) {
            const url = `https://leagueoflegends.fandom.com/api.php?action=parse&text={{rune%20header|${rune.name}}}&contentmodel=wikitext&format=json`;
            const request = await fetch(url).catch(err => {console.log(err);});
            const body = await request.json();
            let dom = new JSDOM(body.parse.text['*'], {contentType: 'text/html'});
            let document = dom.window.document;

            if(document.getElementsByClassName('pi-item pi-data pi-item-spacing pi-border-color')[0] === undefined) {
                embed.setTitle('**Error getting rune or rune tree**');
                rtnEmbeds.push(embed);
                await interaction.editReply({embeds: rtnEmbeds});
                return;
            }

            embed.setTitle(`**${rune.name}**`);
            embed.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`);
            
            let index = 0;
            while ( document.getElementsByClassName('pi-item pi-data pi-item-spacing pi-border-color')[index + 1] !== undefined) {
                embed.addFields({name: '​', value: document.getElementsByClassName('pi-item pi-data pi-item-spacing pi-border-color')[index].textContent});
                index++;
            }

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