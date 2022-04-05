from gtts import gTTS
import Play_mp3
import json

dataToVoice = input()
dataToVoice = json.loads(dataToVoice)
##mytext

mytext = dataToVoice["text"]

language = dataToVoice["language"]

saveFileName = dataToVoice["savefilename"]

saveFileDirectory = dataToVoice["savefiledirectory"]

myobj = gTTS( text=mytext, lang=language, slow=False )


myobj.save( saveFileDirectory + saveFileName + ".mp3" )

print("Complited") 

##Play_mp3.play("welcome.mp3")

# x = input('Enter your name:')
# print('Hello, ' + x) 