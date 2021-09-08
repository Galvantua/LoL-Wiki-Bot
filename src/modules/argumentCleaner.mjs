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
        }
    };

};

// let testarray = ["kog'maw", "passive"]
// let testability = await nameAbility(testarray)
// console.log(testability)