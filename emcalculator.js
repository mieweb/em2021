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
        var text = '"' + this.name + '":{"selected":[' + selected.toArray() + '], "level":' + this.level + '}';
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
        $("#noData").prop("checked", false);
        if (category2 === 0 && category3 === 0) {
            if (category1 < 2) {
                this.level = 2;
                if (category1 === 0) {
                    $("#noData").prop("checked", true);
                }
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
    toggleNone = (e) => {
        if ($(e.currentTarget).prop("checked")) {
            this.clear();
            this.level = 2;
            this.levelHeaders.empty();
            $(this.levelHeaders[this.level - 2]).html('<i class="fa-solid fa-circle-dot"></i>');
            this.headerText.text("Level: " + this.level);
            overallLevel(this.name, this.level);
        }
    }
    run() {
        $("#noData").on("click", {
            event
        }, this.toggleNone);
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
        if (i !== 'level') {
            for (item in i["selected"]) {
                $("#" + item).prop("checked", true);
            }
        }
    }
    run();
}

function clearAll() {
    calculatorData.sections.problems.clear();
    calculatorData.sections.risk.clear();
    calculatorData.sections.data.clear();
    calculatorData.overallLevelElement.removeClass(calculatorData.levelClass[calculatorData.overallLevel - 2]);
    calculatorData.overallLevelElement.text("");
}

function run() {
    calculatorData.overallLevelElement = $('[data-section="overallLevel"]').find(".level-box").not(".erase");
    calculatorData.erase = $('[data-section="overallLevel"]').find(".erase");
    calculatorData.sections = {
        problems: new Section("problems"),
        risk: new Section("risk"),
        data: new Data()
    };
    calculatorData.sections.problems.run();
    calculatorData.sections.risk.run();
    calculatorData.sections.data.run();

    calculatorData.erase.on("click", clearAll);
}

$(document).ready(function() {
    run();
})