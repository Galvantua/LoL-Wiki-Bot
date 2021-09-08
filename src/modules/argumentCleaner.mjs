//Function to clean incoming arguments for champion name and stuff

export async function nameAbility(args) {

    if (args.length === 2) {

        let championName = args[0].toLowerCase(); //TODO make first char uppercase
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

        //uppercase the first letter of a string
        let thing1 = args[0].toLowerCase().replace(/['"^_.]/gm, ''); //TODO make first char uppercase
        let thing2 = args[1].toLowerCase().replace(/['"^_.]/gm, ''); //TODO make first char uppercase
        let championName = thing1 + "_" + thing2;
        let championAbility = args[2].toLowerCase();

        if (!/[qwerp]/gm.test(championAbility) || !championAbility === "passive") {
            return "Invalid ability";
        };

        return {
            championName: championName,
            championAbility: args[1]
        }

    } else if (args.length === 4) {

        let thing1 = args[0].toLowerCase().replace(/['"^_.]/gm, ''); //TODO make first char uppercase
        let thing2 = args[1].toLowerCase().replace(/['"^_.]/gm, ''); //TODO make first char uppercase
        let thing3 = args[2].toLowerCase().replace(/['"^_.]/gm, ''); //TODO make first char uppercase
        let championName = thing1 + "_" + thing2 + "_" + thing3;
        let championAbility = args[3].toLowerCase();

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