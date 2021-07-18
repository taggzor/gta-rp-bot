const Discord = require("discord.js");
const FiveM = require("fivem");
const srv = new FiveM.Server("93.158.236.25:30120");
const bot = new Discord.Client({disableEveryone: false});

let powon = true;
let powoff = false;
let powiadomienie = true;
let serverchannel=0;

let dane={};
let lp=0;
let suma=0;
let kolejnosc={};

let offon = new Discord.MessageEmbed();
let wynik = new Discord.MessageEmbed()
        .setColor('#0099aa')
        .setFooter('Użycie: np kwota 5000')
        .setTitle('Stan Majątkowy');
        
parseInt(suma);

bot.on("ready", async ()=>{
    console.log("Zalogowano");
})

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }



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
setInterval(function(){ 
    if(serverchannel!=0){
        offon.setDescription("@everyone");
        srv.getServerStatus().then(data => {
            if(data.online&&powiadomienie){
                serverchannel.bulkDelete(30);
                offon.setColor('#00ff00');
                offon.setTitle("SERVER ONLINE");
                serverchannel.send(offon);
                powiadomienie= false;
            }
            else if(!data.online&&!powiadomienie){
                serverchannel.bulkDelete(30);
                offon.setColor('#ff0000');
                offon.setTitle("SERVER OFFLINE");
                serverchannel.send(offon);
                powiadomienie=true;
            }
        });

    }
}, 10000);

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
    
    }
    for(var i=0;i<lp;i++){
        wynik.addField(kolejnosc[i].nazwa, formatNumber(kolejnosc[i].kasa)+" $", false);
    }
    wynik.setDescription("Suma mamony: "+ formatNumber(suma)+" $");
    msg.channel.bulkDelete(2);
    msg.channel.send(wynik);
        
    }
    
    
bot.login(process.env.TOKEN);
