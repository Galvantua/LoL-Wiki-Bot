import {
	ActionRowBuilder,
	SlashCommandBuilder,
	EmbedBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js';
import { JSDOM } from 'jsdom';
import { findRune } from '../modules/nameFinders.mjs';
import { format, linkify } from '../modules/format.mjs';

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

        let rtnEmbeds = [];
        let embed = new EmbedBuilder();

        if (!interaction.override)
            await interaction.deferReply();

        try {
        let ref = {isRune: true};
        let givenRune = interaction.override || interaction.options.getString('rune');
        let rune = await findRune(givenRune, ref);
        
        if (rune === undefined) {
            embed.setTitle('**Error getting rune or rune tree**');
            embed.setColor(0xF7A4A4);
            rtnEmbeds.push(embed);
            await interaction.editReply({embeds: rtnEmbeds});
            return;
        } if (rune === null) {
            embed.setTitle('**Rune or rune tree not found**');
            embed.setColor(0xFEBE8C);
            rtnEmbeds.push(embed);
            await interaction.editReply({embeds: rtnEmbeds});
            return;
        }
        
        embed.setColor(0xB6E2A1);

        const treeIcons = { Precision: '<:Precision:1049646550462242866>',
                            Resolve: '<:Resolve:1049646547131969536>',
                            Domination: '<:Domination:1049646548868407316>',
                            Sorcery: '<:Sorcery:1049646552131575848>',
                            Inspiration: '<:Inspiration:1049646545127096371>'};

        if (!ref.isRune) {
            const treeDescriptions = {precision: 'Improved attacks and sustained damage.',
                                    domination: 'Burst damage and target access.',
                                    sorcery: 'Empowered abilities and resource manipulation.',
                                    inspiration: 'Creative tools and rule bending.',
                                    resolve: 'Durability and crowd control.'};
            
            const url = `https://leagueoflegends.fandom.com/api.php?action=parse&text={{Rune%20path%20infobox/${rune.name}}}&contentmodel=wikitext&format=json`;
            const body = await fetch(url).then(async res => await res.json()).catch(err => {throw err});
            const dom = new JSDOM(body.parse.text['*'], {contentType: 'text/html'});
            const document = dom.window.document;

            embed.setTitle(`**${rune.name}**`);
            embed.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`);
            embed.setDescription(`_${treeDescriptions[rune.name.toLowerCase()] || ''}_`)

            

            const slots = new ActionRowBuilder();
            let index = 0;
            while (document.getElementsByClassName('pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background')[index] !== undefined && document.getElementsByClassName(`pi-smart-group-body pi-border-color`)[index] !== undefined && document.getElementsByClassName(`pi-smart-group-body pi-border-color`)[index].textContent.trim()) {
                embed.addFields({name: document.getElementsByClassName('pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background')[index].textContent.includes('Keystone') ? 'Keystone' : document.getElementsByClassName('pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background')[index].textContent, value: document.getElementsByClassName(`pi-smart-group-body pi-border-color`)[index].textContent.trim().replace(/\n/g, ' ').replace(/ {2,}/g, ', ')})
                slots.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`${index}`)
                        .setLabel(document.getElementsByClassName('pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background')[index].textContent.includes('Keystone') ? 'Keystone' : document.getElementsByClassName('pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background')[index].textContent)
                        .setStyle(ButtonStyle.Primary)
                );
                index++;
            }

            rtnEmbeds.push(embed);
            interaction.editReply({embeds: rtnEmbeds, components: [slots]});
            
            const filter = (btnInt) => {
				return interaction.user.id === btnInt.user.id;
			};

            const collector = channel.createMessageComponentCollector({
				filter,
				time: 15000,
			});

            let selectedSlot = 0;
            collector.on('collect', async (i) => {
                await i.deferUpdate();
                
                if (i.customId < 10) {
                    const runeButtons = new ActionRowBuilder();
                    document.getElementsByClassName(`pi-smart-group-body pi-border-color`)[i.customId].textContent.trim().replace(/\n/g, ' ').replace(/ {2,}/g, '||').split('||').map((r, ind) => {
                        runeButtons.addComponents(
                            new ButtonBuilder()
                                .setCustomId(`${10 + ind}`)
                                .setLabel(r)
                                .setStyle(ButtonStyle.Secondary)
                        );
                    });
                    
                    await interaction.editReply({components: [runeButtons]});
                } else {
                    interaction.editReply({ components: []});
                    interaction.override = document.getElementsByClassName(`pi-smart-group-body pi-border-color`)[selectedSlot].textContent.trim().replace(/\n/g, ' ').replace(/ {2,}/g, '||').split('||')[i.customId - 10];
                    this.execute(interaction, channel);
                }
            });

            collector.on('end', async () => {
                await interaction.editReply({
                    components: []
                })
            });

            return;
        } else {
            const url = `https://leagueoflegends.fandom.com/api.php?action=parse&text={{rune%20header|${rune.name}}}&contentmodel=wikitext&format=json`;
            const body = await fetch(url).then(async res => await res.json()).catch(err => {throw err});
            let dom = new JSDOM(body.parse.text['*'], {contentType: 'text/html'});
            let document = dom.window.document;

            if(document.getElementsByClassName('pi-item pi-data pi-item-spacing pi-border-color')[0] === undefined) {
                embed.setTitle('**Error getting rune or rune tree**');
                rtnEmbeds.push(embed);
                await interaction.editReply({embeds: rtnEmbeds});
                return;
            }

            embed.setTitle(`**${treeIcons[rune.tree.name]} ${rune.name}**`);
            embed.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`);
            
            let index = 0;
            let description = '';
            while ( document.getElementsByClassName('pi-item pi-data pi-item-spacing pi-border-color')[index + 1] !== undefined) {
                if (document.getElementsByClassName('pi-item pi-data pi-item-spacing pi-border-color')[index].childElementCount === 2)
                    embed.addFields({name: document.getElementsByClassName('pi-item pi-data pi-item-spacing pi-border-color')[index].children[0].textContent, value: document.getElementsByClassName('pi-item pi-data pi-item-spacing pi-border-color')[index].children[1].textContent});
                else {
                    const linkless = format(document.getElementsByClassName('pi-item pi-data pi-item-spacing pi-border-color')[index]).textContent;
                    const content = linkify(document.getElementsByClassName('pi-item pi-data pi-item-spacing pi-border-color')[index]).textContent;
                    
                    description += content;
                    // if (content.length > 1024)
                    //     embed.addFields({name: '​', value: linkless});
                    // else
                    //     embed.addFields({name: '​', value: content});
                }
                index++;
            }

            embed.setDescription(description);
            rtnEmbeds.push(embed);
            interaction.editReply({embeds: rtnEmbeds});
            return;
        }
    } catch (error) {
        console.error(error);
        embed = new EmbedBuilder();
        embed.setTitle('**Error getting rune or rune tree**');
        embed.setColor(0xF7A4A4);
        rtnEmbeds = [embed];
        interaction.editReply({embeds: rtnEmbeds});
        return;
    }
    }
};