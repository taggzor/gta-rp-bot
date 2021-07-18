const Discord = require("discord.js");
const FiveM = require("fivem");
const srv = new FiveM.Server("93.158.236.25:30120");
const bot = new Discord.Client({disableEveryone: false});

let powon = true;
let powoff = true;
let serverchannel=0;

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
        }
        if(!msg.author.bot) msg.delete();
        console.log(dane);
    }
    

    if(msg.channel.name=="server"){
        serverchannel = msg.channel;
        if(!msg.author.bot) msg.delete();
    }

})
/*setInterval(function(){ 
    if(serverchannel!=0){
        srv.getServerStatus().then(data => {
        if(data.online){
                    if(powon){serverchannel.send(`@everyone Serwer ONLINE`);
                    powon = false;
                    powoff = true;}
                }
                else {
                    if(powoff){
                        serverchannel.send(`@everyone Serwer OFFLINE`);
                    powoff = false;
                    powon = true;}
                }

        });

    }
}, 100000000000000);*/

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
    }
    wynik.setDescription("Suma mamony: "+ formatNumber(suma)+" $");
    msg.channel.bulkDelete(2);
    msg.channel.send(wynik);
        
    }
    
//bot.login(process.env.TOKEN);
