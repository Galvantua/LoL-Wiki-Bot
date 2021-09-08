//Function to clean incoming arguments for champion name and stuff

export async function nameAbility(args) {

    if (args.length === 2) {

        let championName = args[0].toLowerCase();
        let championAbility = args[1].toLowerCase();

        championName = championName.replace(/['"^_.]/gm, '');

        if (!/[qwerp]/gm.test(championAbility) || !championAbility === "passive") {
            return "Invalid ability";
        };

        return {
            championName: championName,
            championAbility: args[1]
        };

    } else if (args.length === 3) {

        let championName = args[0].toLowerCase() + args[1].toLowerCase();
        let championAbility = args[2].toLowerCase();

        championName = championName.replace(/['"^_.]/gm, '');

        if (!/[qwerp]/gm.test(championAbility) || !championAbility === "passive") {
            return "Invalid ability";
        };

        return {
            championName: championName,
            championAbility: args[1]
        }

    } else if (args.length === 4) {

        let championName = args[0].toLowerCase() + args[1].toLowerCase() + args[2].toLowerCase();
        let championAbility = args[3].toLowerCase();

        championName = championName.replace(/['"^_.]/gm, '');

        if (!/[qwerp]/gm.test(championAbility) || !championAbility === "passive") {
            return "Invalid ability";
        };

        return {
            championName: championName,
            championAbility: args[1]
        };

    };

};

// let testarray = ["kog", "maw", "passive"]
// let testability = await nameAbility(testarray)
// console.log(testability)