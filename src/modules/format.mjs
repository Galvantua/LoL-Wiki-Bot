export function format(element) {
    for (let i = 0; i < element.children.length; i++) {
        let child = element.children[i];
        format(child);
        switch (child.getAttribute('data-image-name')) {
            case 'Hybrid resistances icon.png':
                child.parentElement.innerHTML = '<:Hybrid_resistances:1049644163680981022>';
                break;
            case 'Gold.png':
                child.parentElement.innerHTML = '<:Gold:1049630454266998804>';
                break;
            case 'Ranged role.png':
                child.parentElement.innerHTML = '<:Ranged:1049627230776602655>';
                break;
            case 'Melee role.png':
                child.parentElement.innerHTML = '<:Melee:1049626581271851008>';
                break;
            case 'Slow icon.png':
                child.parentElement.innerHTML = '<:Slow:1049627228239040532>';
                break;
            case 'Champion icon.png':
                child.parentElement.innerHTML = '<:Champion:1049627894101577748>';
                break;
            case 'Stun icon.png':
                child.parentElement.innerHTML = '<:CC:1049627891673071677>';
                break;
            case 'Movement speed icon.png':
                child.parentElement.innerHTML = '<:Movement_speed:1049626078236397568>';
                break;
            case 'Heal power icon.png':
                child.parentElement.innerHTML = '<:Heal:1049623247383183400>';
                break;
        }
        if (child.nodeName === 'B' && child.textContent)
            child.innerHTML = `​**​${child.innerHTML}​**​`;
        if (child.nodeName === 'A' && child.parentElement.nodeName !== 'B' && child.textContent && !child.textContent.match(/:.+:/g))
            child.textContent = `​**​${child.textContent}​**​`;
            
        if (child.classList.contains('template_sbc')) {
            if (child.childElementCount === 1 && child.children[0].nodeName === 'B')
                child.innerHTML = `​*​${child.innerHTML.toUpperCase()}​*​`;
            else
                child.innerHTML = `​_​${child.innerHTML.toUpperCase()}​_​`;
        }
            
        if (child.nodeName === 'UL' || child.nodeName === 'OL')
            child.textContent = child.textContent + '\n';
        if (child.nodeName === 'LI')
            child.textContent = '\n• ' + child.textContent;
    
    }
    return element;
}

export function linkify(el) {
    const links = el.querySelectorAll('a');
    for (let i = 0; i < links.length; i++) {
        if (links[i].textContent && !links[i].textContent.match(/:.+:/g))
            links[i].textContent = `[${links[i].textContent}](https://leagueoflegends.fandom.com${links[i].href})`;
    }
    return el;
}