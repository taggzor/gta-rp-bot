const Discord = require("discord.js");

const bot = new Discord.Client();

let dane={};
let lp=0;
let suma=0;
let kolejnosc={};
parseInt(suma);
bot.on("ready", async ()=>{
    console.log("Zalogowano");
})

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }


let wynik = new Discord.MessageEmbed()
        .setColor('#0099aa')
        .setTitle('Stan Majątkowy');


bot.on("message", async msg =>{

    if(msg.channel.name=="spis-majątkowy"){
        if(msg.content.startsWith("kwota ")){
            var ilosc = msg.content.substr(6);
            if(!isNaN(ilosc)) aktualizacja(msg, ilosc);
            
        msg.delete();
        }
       if(!msg.author.bot) msg.delete();
        
    }
    console.log(dane);
})

function aktualizacja(msg, ilosc){
    let gracz=parseInt(msg.author.id);
    let nick=msg.author.username;
    wynik.spliceFields(0,1000);
    if(!dane[gracz]){ 
        suma+=parseInt(ilosc);
        
        dane[gracz] = {
            miejsce: lp,
            kasa: ilosc,
            nazwa: [nick]
        };
        kolejnosc[lp] = dane[gracz];
        lp++;
        
    }
    else {
        suma-=parseInt(dane[gracz].kasa);
        suma+=parseInt(ilosc);
        dane[gracz].kasa = ilosc;
        //wynik.addField(nick, kwota+" $", false);
    
    }
    for(var i=0;i<lp;i++){
        wynik.addField(kolejnosc[i].nazwa, formatNumber(kolejnosc[i].kasa)+" $", false);
        console.log(kolejnosc[i]);
    }
    wynik.setDescription("Suma mamony: "+ formatNumber(suma)+" $");
    msg.channel.bulkDelete(2);
    msg.channel.send(wynik);
        
    }
    
bot.login(process.env.TOKEN);
