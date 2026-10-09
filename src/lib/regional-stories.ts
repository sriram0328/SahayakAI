
export interface Story {
  title: string;
  text: string;
}

export const regionalStories: Record<string, Story[]> = {
  English: [
    {
      title: "The Thirsty Crow",
      text: `One hot day, a thirsty crow flew all over the fields looking for water. For a long time, he could not find any. He felt very weak, almost lost all hope. Suddenly, he saw a pitcher below him. He flew straight down to see if there was any water inside. Yes, he could see some water inside the pitcher!

The crow tried to push his head into the pitcher. Sadly, he found that the neck of the pitcher was too narrow. Then he tried to push the pitcher down for the water to flow out, but he was not strong enough.

He thought hard for a while. Then, looking around him, he saw some pebbles. He suddenly had a good idea. He started picking up the pebbles one by one, dropping each into the pitcher. As more and more pebbles filled the pitcher, the water level kept rising. Soon it was high enough for the crow to drink. His plan had worked! He drank the water and flew away happily.
`,
    },
    {
      title: "The Fox and the Grapes",
      text: `One afternoon, a fox was walking through the forest and spotted a bunch of grapes hanging from a lofty branch. "Just the thing to quench my thirst," he thought.

Taking a few steps back, the fox jumped and just missed the hanging grapes. Again the fox took a few paces back and tried to reach them but still failed.

Finally, giving up, the fox turned up his nose and said, "They're probably sour anyway," and proceeded to walk away.
`,
    },
     {
      title: 'The Lion and the Mouse',
      text: `A lion was once sleeping in his lair when a little mouse began running up and down upon him. This soon wakened the lion, who placed his huge paw upon him, and opened his big jaws to swallow him.

"Pardon, O King!" cried the little mouse. "Forgive me this time. I shall never repeat it and I shall never forget your kindness. And who knows, I may be able to do you a good turn one of these days!"

The Lion was so tickled at the idea of the mouse being able to help him that he lifted up his paw and let him go.

Sometime later, a few hunters captured the lion, and tied him to a tree. After that they went in search of a wagon, to carry him to the zoo.

Just then the little mouse happened to pass by, and seeing the sad plight in which the lion was, went up to him and soon gnawed away the ropes that bound the King of the Beasts. "Was I not right?" said the little mouse, very happy to help the lion.
`,
    },
    {
      title: 'The Hare and the Tortoise',
      text: `A Hare was making fun of the Tortoise one day for being so slow. "Do you ever get anywhere?" he asked with a mocking laugh.

"Yes," replied the Tortoise, "and I get there sooner than you think. I'll run you a race and prove it."

The Hare was much amused at the idea of running a race with the Tortoise, but for the fun of the thing he agreed. So the Fox, who had consented to act as judge, marked the distance and started the runners off.

The Hare was soon far out of sight, and to make the Tortoise feel very deeply how ridiculous it was for him to try a race with a Hare, he lay down beside the course to take a nap until the Tortoise should catch up.

The Tortoise meanwhile kept going slowly but steadily, and, after a time, passed the place where the Hare was sleeping. The Hare slept on very peacefully, and when at last he did wake up, the Tortoise was near the goal. The Hare now ran his swiftest, but he could not overtake the Tortoise in time.
`,
    },
  ],
  Hindi: [
    {
      title: "प्यासा कौआ",
      text: `एक गर्म दिन में, एक प्यासा कौआ पानी की तलाश में पूरे खेतों में उड़ गया। बहुत देर तक उसे कोई पानी नहीं मिला। वह बहुत कमजोर महसूस कर रहा था, लगभग सारी उम्मीद खो चुका था। अचानक, उसने अपने नीचे एक घड़ा देखा। वह सीधे नीचे उड़ गया यह देखने के लिए कि क्या अंदर कोई पानी है। हाँ, वह घड़े के अंदर कुछ पानी देख सकता था!

कौए ने अपना सिर घड़े में डालने की कोशिश की। अफसोस, उसने पाया कि घड़े की गर्दन बहुत संकरी थी। फिर उसने घड़े को नीचे धकेलने की कोशिश की ताकि पानी बाहर निकल जाए, लेकिन वह इतना मजबूत नहीं था।

उसने थोड़ी देर सोचा। फिर, अपने चारों ओर देखकर, उसने कुछ कंकड़ देखे। उसे अचानक एक अच्छा विचार आया। उसने एक-एक करके कंकड़ उठाना शुरू कर दिया, प्रत्येक को घड़े में गिरा दिया। जैसे-जैसे अधिक से अधिक कंकड़ घड़े में भरते गए, पानी का स्तर बढ़ता गया। जल्द ही यह इतना ऊँचा हो गया कि कौआ पी सके। उसकी योजना काम कर गई थी! उसने पानी पिया और खुशी-खुशी उड़ गया।
`,
    },
    {
      title: "लोमड़ी और अंगूर",
      text: `एक दोपहर, एक लोमड़ी जंगल से गुजर रही थी और उसने एक ऊँची शाखा से लटकते हुए अंगूर का एक गुच्छा देखा। "मेरी प्यास बुझाने के लिए यह सही चीज़ है," उसने सोचा।

कुछ कदम पीछे हटकर, लोमड़ी ने छलांग लगाई और लटकते अंगूरों से चूक गई। फिर से लोमड़ी ने कुछ कदम पीछे हटकर उन तक पहुँचने की कोशिश की लेकिन फिर भी असफल रही।

अंत में, हार मानकर, लोमड़ी ने अपनी नाक चढ़ाई और कहा, "वे शायद वैसे भी खट्टे हैं," और आगे बढ़ गई।
`,
    },
  ],
  Tamil: [
    {
      title: "தாகமுள்ள காகம்",
      text: `ஒரு சூடான நாளில், தாகமுள்ள காகம் ஒன்று தண்ணீர் தேடி வயல்வெளிகளில் பறந்து சென்றது. நீண்ட நேரமாகியும் தண்ணீர் கிடைக்கவில்லை. அது மிகவும் பலவீனமாக உணர்ந்தது, கிட்டத்தட்ட எல்லா நம்பிக்கையையும் இழந்தது. திடீரென்று, அது தனக்குக் கீழே ஒரு பானையைப் பார்த்தது. உள்ளே தண்ணீர் இருக்கிறதா என்று பார்க்க நேராகக் கீழே பறந்தது. ஆம், பானையின் உள்ளே கொஞ்சம் தண்ணீர் தெரிந்தது!

காகம் தனது தலையை பானைக்குள் நுழைக்க முயன்றது. ஆனால், பானையின் கழுத்து மிகவும் குறுகலாக இருந்தது. பின்னர் அது பானையைத் தள்ளி தண்ணீரை வெளியேற்ற முயன்றது, ஆனால் அதற்கு போதுமான வலிமை இல்லை.

அது சிறிது நேரம் யோசித்தது. பின்னர், தன்னைச் சுற்றிப் பார்த்தபோது, சில கூழாங்கற்களைக் கண்டது. அதற்கு திடீரென்று ஒரு நல்ல யோசனை வந்தது. அது ஒவ்வொரு கூழாங்கற்களாக எடுத்து, பானையில் போட்டது. கூழாங்கற்கள் பானையில் அதிகமாக அதிகமாக, நீர்மட்டம் உயர்ந்தது. விரைவில் காகம் குடிக்கும் அளவுக்கு நீர்மட்டம் உயர்ந்தது. அதன் திட்டம் வெற்றி பெற்றது! அது தண்ணீரைக் குடித்துவிட்டு மகிழ்ச்சியுடன் பறந்து சென்றது.
`,
    },
    {
      title: "நரியும் திராட்சையும்",
      text: `ஒரு மதியம், ஒரு நரி காட்டின் வழியாக நடந்து கொண்டிருந்தபோது, உயரமான கிளையில் திராட்சை குலை தொங்குவதைக் கண்டது. "என் தாகத்தைத் தணிக்க இதுவே சரியான விஷயம்," என்று அது நினைத்தது.

சில அடிகள் பின்வாங்கி, நரி குதித்தது, ஆனால் திராட்சையைத் தவறவிட்டது. மீண்டும் நரி சில அடிகள் பின்வாங்கி వాటిని చేరుకోవడానికి ప్రయత్నించింది కానీ మళ్ళీ విఫలమైంది.

இறுதியில், முயற்சியைக் கைவிட்டு, நரி தனது மூக்கைத் திருப்பி, "அவை எப்படியும் புளிப்பாகத்தான் இருக்கும்" என்று கூறிவிட்டு நடக்க ஆரம்பித்தது.
`,
    },
  ],
  Telugu: [
    {
      title: "దాహం గొన్న కాకి",
      text: `ఒక వేడి రోజు, దాహం గొన్న కాకి నీటి కోసం పొలాలన్నీ తిరిగింది. చాలా సేపటి వరకు దానికి ఏమీ దొరకలేదు. అది చాలా బలహీనంగా అనిపించింది, దాదాపు ఆశలన్నీ కోల్పోయింది. అకస్మాత్తుగా, అది కింద ఒక కుండను చూసింది. లోపల నీరు ఉందో లేదో చూడటానికి నేరుగా కిందికి ఎగిరింది. అవును, కుండ లోపల కొన్ని నీళ్ళు కనిపించాయి!

కాకి తన తలని కుండలోకి దూర్చడానికి ప్రయత్నించింది. కానీ, కుండ మెడ చాలా ఇరుకుగా ఉందని గ్రహించింది. అప్పుడు నీరు బయటకు ప్రవహించడానికి కుండను కిందికి తోయడానికి ప్రయత్నించింది, కానీ దానికి అంత బలం లేదు.

అది కాసేపు బాగా ఆలోచించింది. చుట్టూ చూస్తే, కొన్ని గులకరాళ్ళు కనిపించాయి. దానికి అకస్మాత్తుగా ఒక మంచి ఆలోచన వచ్చింది. అది ఒక్కొక్క గులకరాయిని எடுத்து, కుండలో వేయడం ప్రారంభించింది. కుండలో గులకరాళ్ళు నిండుతున్న కొద్దీ, నీటి మట్టం పెరుగుతూ వచ్చింది. త్వరలోనే కాకి తాగడానికి సరిపడా ఎత్తుకు నీరు చేరింది. దాని ప్రణాళిక ఫలించింది! అది నీళ్ళు తాగి సంతోషంగా ఎగిరిపోయింది.
`,
    },
    {
      title: "నక్క మరియు ద్రాక్ష",
      text: `ఒక మధ్యాహ్నం, ఒక నక్క అడవిలో నడుస్తూ ఒక ఎత్తైన కొమ్మకు వేలాడుతున్న ద్రాక్ష గుత్తిని చూసింది. "నా దాహం తీర్చుకోవడానికి ఇదే సరైనది," అని అనుకుంది.

కొన్ని అడుగులు వెనక్కి వేసి, నక్క పైకి ఎగిరింది, కానీ వేలాడుతున్న ద్రాక్షను అందుకోలేకపోయింది. మళ్ళీ నక్క కొన్ని అడుగులు వెనక్కి వేసి వాటిని చేరుకోవడానికి ప్రయత్నించింది కానీ మళ్ళీ విఫలమైంది.

చివరికి, ప్రయత్నం విరమించుకుని, నక్క ముఖం తిప్పుకుని, "అవి బహుశా పుల్లగా ఉంటాయి," అని చెప్పి ముందుకు సాగింది.
`,
    },
  ],
  Marathi: [
    {
      title: "तहानलेला कावळा",
      text: `एका उष्ण दिवशी, एक तहानलेला कावळा पाण्याच्या शोधात संपूर्ण शेतात फिरला. बराच वेळ त्याला काहीही सापडले नाही. त्याला खूप अशक्त वाटले, जवळजवळ सर्व आशा गमावली. अचानक, त्याने खाली एक भांडे पाहिले. आत पाणी आहे की नाही हे पाहण्यासाठी तो थेट खाली उडाला. होय, त्याला भांड्यात थोडे पाणी दिसले!

कावळ्याने आपले डोके भांड्यात घालण्याचा प्रयत्न केला. पण, त्याला आढळले की भांड्याची मान खूपच अरुंद आहे. मग त्याने पाणी बाहेर वाहण्यासाठी भांडे खाली ढकलण्याचा प्रयत्न केला, पण तो तितका मजबूत नव्हता.

त्याने थोडा वेळ विचार केला. मग, आजूबाजूला पाहिल्यावर त्याला काही खडे दिसले. त्याला अचानक एक चांगली कल्पना सुचली. त्याने एकेक करून खडे उचलण्यास सुरुवात केली आणि प्रत्येक खडा भांड्यात टाकला. भांड्यात अधिकाधिक खडे भरल्यामुळे पाण्याची पातळी वाढत गेली. लवकरच कावळ्याला पिण्यासाठी पाणी पुरेसे उंच झाले. त्याची योजना यशस्वी झाली होती! त्याने पाणी प्यायले आणि आनंदाने उडून गेला.
`,
    },
    {
      title: "कोल्हा आणि द्राक्षे",
      text: `एका दुपारी, एक कोल्हा जंगलातून जात असताना त्याला एका उंच फांदीला लटकलेली द्राक्षांची घड दिसली. "माझी तहान भागवण्यासाठी हीच योग्य गोष्ट आहे," त्याने विचार केला.

काही पावले मागे जाऊन, कोल्హ्याने उडी मारली आणि लटकलेल्या द్రాक्षांना थोडक्यात हुकवले. पुन्हा कोल्ह्याने काही पावले मागे जाऊन त्यांना पोहोचण्याचा प्रयत्न केला पण तरीही अयशस्वी ठरला.

शेवटी, हार मानून, कोल्ह्याने नाक मुरडले आणि म्हणाला, "ती द्राक्षे कदाचित आंबट असतील," आणि पुढे निघून गेला.
`,
    },
  ],
};
