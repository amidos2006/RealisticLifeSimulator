class Global{
    static totalVerbs:Verb[];
    static taskNumber:number;
    static failedTask:string;
    static failedLoading:Boolean = false;
    static music:Phaser.Sound;
    static minAcceptableVerbs:number = 30;
    static lastText:BackgroundText[] = [];
    
    static getTime(){
        return Math.max(500, 2000 - Global.taskNumber * 150);
    }
    
    static getRandomColor(game:Phaser.Game, inputText:string) {
        var seed:number = 0;
        if(inputText != null){
            for(var x:number =0; x<inputText.length; x++){
                seed += inputText.charCodeAt(x) * Math.pow(10, x);
            }
        }
        else{
            seed = game.rnd.integer();
        }
        game.rnd.sow([seed]);
        var h:number = game.rnd.realInRange(0, 1);
        var s:number = 0.5;
        var v:number = 0.7;
        
        var r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        
        return Math.round(r * 255) << 16 | Math.round(g * 255) << 8 | Math.round(b * 255);
    }
    
    static checkValidity(verb:String){
        if(verb.split(" ").length <= 1) return true;
        
        var data1:string = verb.split(",")[0];
        var data2:string = verb.split(" ")[0].split(",")[0];
        
        if(data1.trim() == data2.trim()) return false;
        
        var data1:string = verb.split("and ")[0];
        var data2:string = verb.split(" ")[0];
        
        return data1.trim() != data2.trim();
    }
    
    static fixVerbs(verb:String){
        var result:string[] = [];
        var data:string[] = verb.split(",");
        console.log(data);
        for(var i:number=0;i<data.length;i++){
            result = result.concat(data[i].trim().split("and "));
        }
        return result;
    }
    
    static getInfinitive(verb:String){
        var xmlHttp:XMLHttpRequest = new XMLHttpRequest();
        var params = "spelling=" + verb + "&corpusConfig=ncf&media=json";
        xmlHttp.open("POST", "http://devadorner.northwestern.edu/maserver/lexiconlookup", false);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send(params);
        
        var temp:JSON = JSON.parse(xmlHttp.responseText);
        if(temp["LexiconLookupResult"]["lexiconEntry"] == undefined){
            //console.log(verb);
            params = "spelling=" + verb + "&standardize=true&wordClass=verb&wordClass2=verb&corpusConfig=ncf&media=json";
            xmlHttp.open("POST", "http://devadorner.northwestern.edu/maserver/lemmatizer", false);
            xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlHttp.send(params);
            var temp:JSON = JSON.parse(xmlHttp.responseText);
            //console.log(temp["LemmatizerResult"]["lemma"]);
            return temp["LemmatizerResult"]["lemma"];
        }
        var maxIndex:number = 0;
        for(var i:number=1;i<temp["LexiconLookupResult"]["lexiconEntry"]["lemmata"][0]["entry"].length;i++){
            var bestValue:number = temp["LexiconLookupResult"]["lexiconEntry"]["categoriesAndCounts"][0]["entry"][maxIndex]["MutableInteger"]["mutableInteger"];
            var newValue:number = temp["LexiconLookupResult"]["lexiconEntry"]["categoriesAndCounts"][0]["entry"][i]["MutableInteger"]["mutableInteger"];
            if(newValue > bestValue){
                maxIndex = i;
            }
        }
        if(temp["LexiconLookupResult"]["lexiconEntry"]["lemmata"][0]["entry"][maxIndex] == undefined){
            return temp["LexiconLookupResult"]["lexiconEntry"]["lemmata"][0]["entry"]["string"][1]
        }
        return temp["LexiconLookupResult"]["lexiconEntry"]["lemmata"][0]["entry"][maxIndex]["string"][1];
    }
    
    static getIng(verb:String){
        var xmlHttp:XMLHttpRequest = new XMLHttpRequest();
        var params = "infinitive=" + verb + "&verbTense=presentParticiple&media=json";
        xmlHttp.open("POST", "http://devadorner.northwestern.edu/maserver/verbconjugator", false);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send(params);
        return JSON.parse(xmlHttp.responseText)["VerbConjugatorResult"]["firstPersonSingular"];
    }
    
    static getURI(noun:string){
        var xmlHttp:XMLHttpRequest = new XMLHttpRequest();
        xmlHttp.open("GET", "http://conceptnet5.media.mit.edu/data/5.4/uri?language=en&text=" + noun, false);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send(null);
        return JSON.parse(xmlHttp.responseText)["uri"];
    }
    
    static getVerbs(noun:string){
        var xmlHttp:XMLHttpRequest = new XMLHttpRequest();
        xmlHttp.open("GET", "http://conceptnet5.media.mit.edu/data/5.4/search?rel=/r/CapableOf&limit=200&start=" + Global.getURI(noun), false);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send(null);
        var verbs:string[] = [];
        var data:Object[] = JSON.parse(xmlHttp.responseText)["edges"];
        for(var i:number=0; i<data.length; i++){
            var temp:string = <string>data[i]["surfaceEnd"];
            if(Global.checkValidity(temp)){
                verbs.push(temp);
            }
            else{
                verbs = verbs.concat(Global.fixVerbs(temp));
            }
        }
        
        return verbs;
    }
    
    static getAlternativeVerbs(verb:string){
        var xmlHttp:XMLHttpRequest = new XMLHttpRequest();
        xmlHttp.open("GET", "http://conceptnet5.media.mit.edu/data/5.4/search?rel=/r/UsedFor&limit=200&start=" + Global.getURI(verb), false);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send(null);
        var verbs:string[] = [];
        var data:Object[] = JSON.parse(xmlHttp.responseText)["edges"];
        for(var i:number=0; i<data.length; i++){
            var temp:string = <string>data[i]["surfaceEnd"];
            if(Global.checkValidity(temp)){
                verbs.push(temp);
            }
            else{
                verbs = verbs.concat(Global.fixVerbs(temp));
            }
        }
        
        return verbs;
    }
    
    static getSimilarWords(noun:string){
        var nouns:string[] = [];
        var xmlHttp:XMLHttpRequest = new XMLHttpRequest();
        var data:Object[] = null;
        
        // var xmlHttp:XMLHttpRequest = new XMLHttpRequest();
        // var params = "spelling=" + noun + "&wordClass=noun&media=json";
        // xmlHttp.open("POST", "http://devadorner.northwestern.edu/maserver/thesaurus", false);
        // xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        // xmlHttp.send(params);
        // console.log(JSON.parse(xmlHttp.responseText));
        
        xmlHttp.open("GET", "http://conceptnet5.media.mit.edu/data/5.4/search?rel=/r/DefinedAs&limit=200&start=" + Global.getURI(noun), false);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send(null);
        data = JSON.parse(xmlHttp.responseText)["edges"];
        for(var i:number=0; i<data.length; i++){
            nouns.push(<string>data[i]["surfaceEnd"]);
        }
        
        xmlHttp.open("GET", "http://conceptnet5.media.mit.edu/data/5.4/search?rel=/r/DefinedAs&limit=200&end=" + Global.getURI(noun), false);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send(null);
        data = JSON.parse(xmlHttp.responseText)["edges"];
        for(var i:number=0; i<data.length; i++){
            nouns.push(<string>data[i]["surfaceStart"]);
        }
        
        xmlHttp.open("GET", "http://conceptnet5.media.mit.edu/data/5.4/search?rel=/r/Synonym&limit=200&start=" + Global.getURI(noun), false);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send(null);
        data = JSON.parse(xmlHttp.responseText)["edges"];
        for(var i:number=0; i<data.length; i++){
            nouns.push(<string>data[i]["surfaceEnd"]);
        }
        
        xmlHttp.open("GET", "http://conceptnet5.media.mit.edu/data/5.4/search?rel=/r/Synonym&limit=200&end=" + Global.getURI(noun), false);
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send(null);
        data = JSON.parse(xmlHttp.responseText)["edges"];
        for(var i:number=0; i<data.length; i++){
            nouns.push(<string>data[i]["surfaceStart"]);
        }
        
        return nouns;
    }
    
    static constructVerbs(verbs:string[]){
        Global.totalVerbs = [];
        for(var i:number=0; i<verbs.length; i++){
            verbs[i] = verbs[i].replace(" your ", " people\'s ");
            verbs[i] = verbs[i].replace(" my ", " people\'s ");
            verbs[i] = verbs[i].replace(" his ", " your ");
            verbs[i] = verbs[i].replace(" himself ", " yourself ");
            verbs[i] = verbs[i].replace(" her ", " your ");
            verbs[i] = verbs[i].replace(" herself ", " yourself ");
            verbs[i] = verbs[i].replace(" its ", " your ");
            verbs[i] = verbs[i].replace(" itself ", " yourself ");
            var parts:string[] = verbs[i].trim().split(" ");
            var infinitive:string = Global.getInfinitive(parts[0].trim());
            var continous:string = Global.getIng(infinitive.trim());
            for(var j:number=1;j<parts.length;j++){
                infinitive += " " + parts[j].trim();
                continous += " " + parts[j].trim();
            }
            Global.totalVerbs.push(new Verb(infinitive, continous));
        }
        Global.totalVerbs = Phaser.ArrayUtils.shuffle(Global.totalVerbs);
    }
}