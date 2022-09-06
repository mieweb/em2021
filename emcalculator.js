var calculatorData = {
    levelClass: [
        "low",
        "medium",
        "moderate",
        "high",
    ],
    levels: {
        "problems": 0,
        "risk": 0,
        "data": 0
    },
    overallLevel: 0
}

function overallLevel(name, level) {
    if (calculatorData.overallLevel !== 0) {
        $(calculatorData.overallLevelElement).removeClass(calculatorData.levelClass[calculatorData.overallLevel - 2]);
        calculatorData.overallLevelElement.text("");
    }
    calculatorData.levels[name] = level;
    let levelValues = Object.values(calculatorData.levels);
    if (!levelValues.includes(0)) {
        calculatorData.overallLevel = levelValues.sort()[1];
        $(calculatorData.overallLevelElement).addClass(calculatorData.levelClass[calculatorData.overallLevel - 2]);
        $(calculatorData.overallLevelElement).text(calculatorData.overallLevel);
    } else {
        calculatorData.overallLevel = 0;
    }
}

class Section {
    constructor(name) {
        this.name = name;
        this.items = $('[data-section="' + name + '"]');
        this.headerText = this.items.first().find(".text-right")
        this.levelHeaders = this.items.first().find(".level-box").not(".erase");
        this.erase = this.items.first().find(".erase");
        this.level = 0;
    }
    getSelected() {
        return this.items.find(":checked");
    }
    getJSONString = () => {
        var selected = this.getSelected().map(function() {
            return '"' + this.id + '"';
        });
        var settings = new Map($(this.items).find(":checkbox").map(function() {
            return [
                [this.id, $(this).prop("checked")]
            ]
        }));

        settings = JSON.stringify(Object.fromEntries(settings));
        var text = '"' + this.name + '":{"selected":[' + selected.toArray() + '], "settings": ' + settings + ', "level":' + this.level + '}';
        return text;
    }
    clear = () => {
        (this.getSelected()).prop("checked", false);
        this.items.find(":disabled").prop("disabled", false);
        this.levelHeaders.empty();
        this.level = 0;
        this.headerText.text("Level: " + this.level);
        overallLevel(this.name, this.level);
    }
    toggleDisable(a) {
        if ($(a).prop("checked")) {
            $(a).parent().siblings().each(function() {
                $(this).find(":input").prop("disabled", true);
            });
        } else {
            $(a).parent().siblings().each(function() {
                $(this).find(":input").prop("disabled", false);
            });
        }
    }
    getLevelValue() {
        return parseInt($(this).data("level"));
    }
    calculateSectionLevel = () => {
        if (this.getSelected().length === 0) {
            this.level = 0;
            this.levelHeaders.empty();
        } else {
            this.level = Math.max(...this.getSelected().map(this.getLevelValue));
            this.levelHeaders.empty();
            $(this.levelHeaders[this.level - 2]).html('<i class="fa-solid fa-circle-dot"></i>');
        }
        this.headerText.text("Level: " + this.level);
        overallLevel(this.name, this.level);
    }
    run() {
        this.levelHeaders.on("click", (e) => {
            this.clear();
            this.level = $(e.currentTarget).index() + 1;
            $(this.levelHeaders[this.level - 2]).html('<i class="fa-solid fa-circle-dot"></i>');
            this.headerText.text("Level: " + this.level);
            overallLevel(this.name, this.level);
        })
        this.items.find(":checkbox").on("click", (e) => {
            this.toggleDisable($(e.currentTarget));
            this.calculateSectionLevel();
        });
        this.erase.on("click", this.clear);
    }
}

class Data extends Section {
    constructor() {
        super("data");
        this.category1 = this.items.find('[data-category="1"]');
        this.category2 = this.items.find('[data-category="2"]');
        this.category3 = this.items.find('[data-category="3"]');
    }
    calculateCategory(x) {
        var count = 0;
        $(x).each(function() {
            count += parseInt($(this).val());
        });
        return count;
    };
    calculateSectionLevel = () => {
        var category1 = this.calculateCategory(this.category1.find(":checked"));
        var category2 = this.calculateCategory(this.category2.find(":checked"));
        var category3 = this.calculateCategory(this.category3.find(":checked"));
        if (category1 === 0 && category2 === 0 && category3 === 0 && !$("#noData").prop("checked")) {
            this.level = 0;
        } else if (category2 === 0 && category3 === 0) {
            if (category1 < 2) {
                this.level = 2;
            } else if (category1 === 2 || $("#assesmentHistorian").prop("checked") === true) {
                this.level = 3;
            } else {
                this.level = 4;
            }

        } else {
            if (category1 > 2 || (category2 > 0 && category3 > 0)) {
                this.level = 5;
            } else {
                this.level = 4;
            }
        }
        this.levelHeaders.empty();
        $(this.levelHeaders[this.level - 2]).html('<i class="fa-solid fa-circle-dot"></i>');
        this.headerText.text("Level: " + this.level);
        overallLevel(this.name, this.level);
    }
    toggleDisable = (a) => {
        if ($("#noData").prop("checked")) {
            this.category1.find(":checkbox").prop("disabled", true);
            this.category2.find(":checkbox").prop("disabled", true);
            this.category3.find(":checkbox").prop("disabled", true);
        } else {
            this.category1.find(":checkbox").prop("disabled", false);
            this.category2.find(":checkbox").prop("disabled", false);
            this.category3.find(":checkbox").prop("disabled", false);
            if (this.items.find(":checked").length > 0) {
                $("#noData").prop("disabled", true);
            } else {
                $("#noData").prop("disabled", false);
            }
        }
        super.toggleDisable(a);
    }
    run() {

        super.run();
    }
}

function get_JSON() {
    var text = '{';
    for (section in calculatorData.sections) {
        text += calculatorData.sections[section].getJSONString() + ',';
    };
    text += '"level":' + calculatorData.overallLevel + '}';
    return jQuery.parseJSON(text);
}

function from_JSON(json) {
    for (i in json) {
        if (i !== "level") {
            for (j in json[i].settings) {
                $("#" + j).prop("checked", json[i].settings[j])
            }
            calculatorData.sections[i].calculateSectionLevel();
        }
    }
}

function clearAll() {
    calculatorData.sections.problems.clear();
    calculatorData.sections.risk.clear();
    calculatorData.sections.data.clear();
    calculatorData.overallLevelElement.removeClass(calculatorData.levelClass[calculatorData.overallLevel - 2]);
    calculatorData.overallLevelElement.text("");
}

function showJSON() {
    var json = get_JSON();
    $("#jsonText").val(JSON.stringify(json, null, 2));
}

function loadJSON() {
    clearAll();
    var json = JSON.parse($("#jsonText").val());
    from_JSON(json);
}

function run() {
    calculatorData.overallLevelElement = $('[data-section="overallLevel"]').find(".level-box").not(".erase");
    calculatorData.erase = $('[data-section="overallLevel"]').find(".erase");
    calculatorData.sections = {
        problems: new Section("problems"),
        risk: new Section("risk"),
        data: new Data()
    };
    $("#showJSONButton").on("click", showJSON);
    $("#loadJSONButton").on("click", loadJSON);
    calculatorData.sections.problems.run();
    calculatorData.sections.risk.run();
    calculatorData.sections.data.run();

    calculatorData.erase.on("click", clearAll);
}

$(document).ready(function() {
    run();
})