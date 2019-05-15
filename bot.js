const Discord = require("discord.js");
const client = new Discord.Client();
const twit = require("./twit");

client.on("ready", () => {
  const generalChannel = client.channels.get("573118710424928258");
  generalChannel.send("hello world");

  client.on("message", receivedMessage => {
    if (receivedMessage.author == client.user) {
      return;
    }
    if (receivedMessage.content.startsWith("!")) {
      processCommand(receivedMessage);
    }
  });
  function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1);
    let splitCommand = fullCommand.split(" ");
    let primaryCommand = splitCommand[0];
    let arguments = splitCommand.slice(1);

    if (primaryCommand == "help") {
      helpCommand(arguments, receivedMessage);
    } else if (primaryCommand == "hashtag") {
      getTweetsFromHashtag(arguments, receivedMessage);
    } else {
      receivedMessage.channel.send(
        "I don't understand the command. Try `!help` or `!multiply`"
      );
    }
  }
  function getTweetsFromHashtag(arguments, receivedMessage) {
    let [query, amount] = arguments;
    if (arguments.length > 2) {
      receivedMessage.channel.send(
        `${receivedMessage.author.toString()} too many arguments`
      );
    }
    twit.get("search/tweets", { q: `'#${query}` }, function(
      err,
      data,
      response
    ) {
      let slicedData = data.statuses.slice(0, amount);
      for (tweet in slicedData) {
        receivedMessage.channel.send(slicedData[tweet].text);
      }
    });
  }
  function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
      receivedMessage.channel.send(
        `Looks like you may need help with "${arguments}"`
      );
    } else {
      receivedMessage.channel.send(
        "I'm not sure what you need help with. Try `!help [topic]`"
      );
    }
  }
});

client.login(require("./config").BOT_SECRET_TOKEN);
