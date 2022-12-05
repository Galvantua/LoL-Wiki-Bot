export function format(element) {
    for (let i = 0; i < element.children.length; i++) {
        let child = element.children[i];
        format(child);
        switch (child.getAttribute('alt')) {
            case 'Ranged role.png':
                child.parentElement.innerHTML = ':dart:';
                break;
            case 'Melee role.png':
                child.parentElement.innerHTML = ':crossed_swords:';
                break;
            case 'Slow icon.png':
                child.parentElement.innerHTML = ':snowflake:';
                break;
            case 'Champion icon.png':
                child.parentElement.innerHTML = ':fairy:';
                break;
            case 'Stun icon.png':
                child.parentElement.innerHTML = ':cloud_tornado:';
                break;
            case 'Movement speed icon.png':
                child.parentElement.innerHTML = ':athletic_shoe:';
                break;
            case 'Heal power icon.png':
                child.parentElement.innerHTML = ':revolving_hearts:';
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
        if (links[i].textContent && (!links[i].textContent.match(/:.+:/g) || links[i].textContent.match(/:.+:/g)[0].length !== links[i].textContent.length))
            links[i].textContent = `[${links[i].textContent}](https://leagueoflegends.fandom.com${links[i].href})`;
    }
    return el;
}