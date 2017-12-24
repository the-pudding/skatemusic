## Clean Genre Assignments ####
suppressMessages(library(tidyverse))

## Load data ####
DATA_PATH <- '../../data/skate_data_uncleaned.csv'
df <- suppressMessages(read_csv(DATA_PATH))
df$index <- NULL
count_df <- df
count_df$genre <- NULL

## Reassign genres to broader categories ####
count_df$genre[count_df$genre2 %in% c("50's Rock", "60's Rock", "70's Rock", "European Pop", "Folk Rock", "New Romantic",
                                      "Retro Rock Revival", "Western Pop"
)] = 'Classic Rock'
Oldies <- c("Classic Country", "Classic Pop Vocals")
count_df$genre[count_df$genre2 %in% c("Dance & Club", "Dubstep", "Downtempo, Lounge & Ambient", "Electronica Fusion",
                                      "Electronica Mainstream", "Game Music", "House", "Indian Subcontinent Pop", "Techno",
                                      "Trance")] = 'Electronic'

count_df$genre[count_df$genre2 %in% c("Asian Hip-Hop/Rap", "Animation", "Caribbean Pop", "Latin Hip-Hop/Rap", "Reggae",
                                      "Western Hip-Hop/Rap")] = 'Hip Hop'
count_df$genre[count_df$genre2 %in% c("Adult Alternative Rock", "Alternative", "Alternative Folk", "Alternative Roots",
                                      "Brit Pop", "Brit Rock", "Contemporary Era", "Folk", "Indie Rock", "New Wave Pop",
                                      "New Wave Rock", "Synth Pop"
)] = 'Indie/Alternative'
count_df$genre[count_df$genre2 %in% c("Acoustic Blues", "Bebop & Modern Jazz", "African Pop", "African Traditional",
                                      "Asian Traditional", "Big Band & Swing", "Classic R&B/Soul", "Contemporary Jazz & Fusion",
                                      "Contemporary R&B/Soul", "Funkadelic", "Mateo Messina", "Disco", "Early Jazz",
                                      "Electric Blues", "Jazz Vocals", "Jungle/Drum 'n' Bass", "Latin & World Jazz",
                                      "Smooth Jazz", "South American"
)] = "Jazz/Soul"
count_df$genre[count_df$genre2 %in% c("Goth", "Hard Rock", "Industrial", "Metal")] = 'Metal'

count_df$genre[count_df$genre2 %in% c("Emo & Hardcore", "Punk", "Rockabilly Revival", "Ska Revival", "Surf Revival"
)] = 'Punk'
count_df$genre[count_df$genre2 %in% c("Garage Rock Revival", "Mainstream Rock")] = 'Rock'

count_df$genre[count_df$genre2 %in% c("Baroque Era",  "Brazilian", "Celtic", "Children's", "Chinese Pop", "Classic Pop Vocals",
                                      "Classical Crossover", "Comedy", "Country","Data & Other",  "Easy Listening", "European Rock",
                                      "European Traditional", "Holiday", "Indian Traditional", "Jam Bands", "Japanese Pop",
                                      "Japanese Rock", "Latin Pop", "Latin Rock", "Latin Traditional", "Mexican",
                                      "Mid-East Traditional", "Middle East Pop", "Modern Era", "New Age", "Original Film/TV Music",
                                      "Other Classical", "Other Classical", "Power Pop", "Reggaetón", "Religious", "Romantic",
                                      "Sound Effects & Ringtones", "Spoken Word", "Sports Themes", "Stage Musicals"
)] = 'Other'

count_df <- count_df %>%
  filter( !(genre2 %in% c("Asian Pop", "Classical Era", "Swing Revival")))


count_df$artist[count_df$artist == 'Eternal Summer'] = 'Eternal Summers'
count_df$artist[count_df$artist == 'Arthur Russel'] = 'Arthur Russell'
count_df$artist[count_df$artist == 'Shit Kickers'] = 'Shitkickers'
count_df$artist[count_df$artist == 'Patty Smith'] = 'Patti Smith'
count_df$artist[count_df$artist == 'Reverend Horton Heat'] = 'The Reverend Horton Heat'
count_df$artist[count_df$artist == 'Native Baron'] = 'Baron'
count_df$artist[count_df$artist == 'Matti Costa'] = 'Matt Costa'
count_df$artist[count_df$artist == 'Streets'] = 'The Streets'
count_df$artist[count_df$artist == 'Mamas and the Papas'] = 'The Mamas & The Papas'
count_df$artist[count_df$artist == ''] = ''
count_df$artist[count_df$artist == ''] = ''
count_df$artist[count_df$artist == ''] = ''
count_df$artist[count_df$artist == ''] = ''

## Manually assign poorly assigned Artists ####
count_df$genre[count_df$artist %in% c('Enoch', 'Mr. Dibbs', 'Odd Nosdam', 'Baron', 'Adeodat Warfield',
                                      'DJ Egadz', 'DJ Mutt', 'Air', '((sounder))', 'Jel', 'DJ Frane',
                                      'Le Tigre', 'deadxbeat', 'DJ Greyboy', 'DJ Kechup', 'DJ Sureshot',
                                      'Eighty Mile Beach', 'Mophono', 'Shed', 'Busy P',
                                      'Nobody', 'Aim', 'Dutch Dub', 'Andy Caldwell', 'Broken Spindles',
                                      'Vangelis', 'Vito Y Coco', 'Sixtoo', 'Baron', 'Sol', "Salem",
                                      "Blvck Ceiling", "Baron", "Emperor Penguin", "Digital Cutup Lounge",
                                      "Ellie Goulding", "Death In Vegas", "Balam Acab", "Justin Bates",
                                      "Martin Solveig & Dragonette", "Martin Solveig",
)] = 'Electronic'

count_df$genre[count_df$artist %in% c('Bad Shit', 'Hightower', 'Pegboy', 'Sweet Apple','Graveyard',
                                      'Black Mountain', 'Nihilist', 'The LSDemons', 'ASG',
                                      'Fretblanket', 'Grindline The Band', 'Hum', 'Tool',
                                      'Dead Meadow', 'The Sadies', 'Valient Thorr', 'Viking Skull',
                                      'Motörhead', 'J Mascis and the Fog', 'Lard', 'Roky Erickson',
                                      "Black Rose", "The Invisibles","Hightower", "Cky", "CKY",
                                      "Black", "Mercyful Fate", "Guns N' Roses", "Motörhead",
                                      "Slayer", "Earthless", "Green Leaf", "Flower Travlin' Band",
                                      "Bleed The Sky", "Boris", "Sweet Apple", "Red Planet"

)] = 'Metal'

count_df$genre[count_df$artist %in% c('Euphone', 'Caural', 'Duane Pitre', 'Rodrigo & Gabriela',
                                      'Jet Black Crayon', 'Bob James', 'Mother Earth', 'Bob Marley',
                                      'Sizzla', "Tenor Saw", "Pete Drake", "Carlinhos Zodi" )] = 'Jazz/Soul'

count_df$genre[count_df$artist %in% c('Atiba', 'Guru', 'Money Mark', 'Bracket', 'Chad Muska',
                                      'Hurakan', 'Kanye West', 'Sacred Hoop', 'Swollen Members',
                                      'The Grouch', 'Extra Prolific', 'Hip Hop For Respect',
                                      'Slippers', 'Budgie', 'Gorillaz', 'Styles of Beyond',
                                      "Jigz Crillz", "Rok One", "P.H.A.T", "456 Productions",
                                      "Islah Guzman", "Alf Diggi", "Chris Gentry", "Eazy E",
                                      "Spark Master Tape", "12 Jewelz", "Sacred Hoop", "Jeep Beat Collective",
                                      "Notorious B.I.G.", "Galliano", "Neptunes", "Deadxbeat", "Chad Muska",
                                      "The Streets"
)] = 'Hip Hop'

count_df$genre[count_df$artist %in% c('Curtis Mayfield', 'Nina Simone', 'Marvin Gaye',
                                      'Stevie Wonder', 'Al Green', 'Ben Harper', 'Michael Jackson',
                                      'Bobby Womack', 'Prince', 'Rick James', 'The Commodores',
                                      'The Temptations', 'Frank Sinatra', 'Ananda Shankar', 'Saxman',
                                      "Ray Barbee", "Homenagon A Mongo", "Lionel Richie ",
                                      "Philip Glass", "Phillip Glass", "Luis Bacalov", "Big Band Katowice",
                                      "Hermon Hitson", "Harry Warren, Jack Brooks", "Pat Williams Orchestra",
                                      "Cee Knowledge", "Slim And The Soulful Saints", "Tommy Guerrero",
                                      "Tommy Guerrero & Monte Vallier", "Cinematic Orchestra",
                                      "The James Taylor Quartet", "Soul Train Soul",
                                      "Tommy Guerrero & Mark Gonzales", "Tommy Guerrero & DJ Pause",
                                      "Brooklyn Funk Essentials", "Solsonics", "Jestofunk",
                                      "Ralph Myerz and the Jack Herren Band", "Wizards Of Ooze",
                                      "Palace of Pleasure", "The Brand New Heavies", "Jim Sound Entley",
                                      "Pink Martini", "Tommy Guerrero & Gadget Enhanced", "Paco De Lucia",
                                      "Peru Negro", "Los Incas", "Ray Barbee"
)] = 'Jazz/Soul'

count_df$genre[count_df$artist %in% c('Belle & Sebastian', 'Eternal Summers', 'Elliot Smith',
                                      'Matt Costa', 'Weird War', "Ariel Pink's Haunted Graffiti",
                                      'Kelley Stoltz', 'The Greenhornes', 'The Organ', 'The Sounds',
                                      'Whitey', 'A Band of Bees', 'Birds of Avalon', 'Doves',
                                      'Luscious Jackson', 'Madonna', 'Old Canes', 'Pepper Rabbit',
                                      'The Go! Team', 'Depeche Mode', 'The Black Lips', 'The Cry',
                                      'The Teenagers', 'The Zoo', 'Wonderful Broken Thing',
                                      'Liam The Younger', 'Seafood', 'Spindrift', 'Amadou & Mariam',
                                      "Who Made Who", "Afterimage", "The Len Brown Society",
                                      "Gifthorse", "The People's Temple", "Barry Louis Polisar",
                                      "The Downtown Struts", "Die Jungen", "The Crocodiles",
                                      "The Devil Makes Three", "Henries Holborn", "Rock Plaza Central",
                                      "Leeroy Stagger", "White Flight", "Main Fear Love", "The Wiseguys",
                                      "Kid loco", "Kid Loco", "Lana del Rey", "Danger Beach", "Chemical Brothers",
                                      "The Chemical Brothers", "The 2 Bears", "The Mynabirds", "Dracula Lewis",
                                      "Puro Instinct", "Teddybears", "The Similou", "Audionom", "Inina Gap",
                                      "Teddybears Stockholm", "Pedro The Lion", "Matt Costa", "Manu Chao",
                                      "Arthur Russell", "The Minders", "The Nerves", "New Order",
                                      "Depeche Mode", "Yael Naim", "Gwen Stefani", "Katy Perry",
                                      "Edward Sharpe And The Magnetic Zeroes"
)] = 'Indie/Alternative'

count_df$genre[count_df$artist %in% c('The Adolescents', 'The Odd Numbers', 'Bad Strip',
                                      'Division of Laura Lee', 'Sub Society', 'Dance Hall Crashers',
                                      'Drunk Injuns', 'Marginal Man', 'Rudimentary Peni', 'The Heartaches',
                                      'The Saints', 'The Buzzcocks', 'The Needles', 'The Veebees',
                                      'Los Olvidados', 'Smut Peddlers', "The Spits", "Shed", "Blur",
                                      "Elastica", "Sands", "Plaid Rentina", "Plaid Retina", "Embrace",
                                      "The Milkshakes", "Pissboner", "Loren Humphrey", "Rat Fist",
                                      "Shitkickers", "Gangbusters", "Delaware White Thrash",
                                      "Tilt Wheel", "Devo", "Willie Grundle And The Taints", "Yuck",
                                      "Vermillion Sands", "The Triggers", "The Plague", "Monarch Box",
                                      "Golden Shower", "Livingdead", "Johnny & The Dudes", "Badshit",
                                      "The Scematics", "The Authorities", "GG Allin and The Murder Junkies",
                                      "The Richmond Sluts", "The Clash", "Devo", "Patti Smith",
                                      "Elvis Costello", "The Jam", "The Modern Lovers", "The Only Ones",
                                      "The Cry", "The Cramps", "Reverend Horton Heat", "The Legendary Shack Shakers",
                                      "The Peacocks"
)] = 'Punk'

count_df$genre[count_df$artist %in% c('Johnny Cash', 'Love', 'Red Octopus', 'Dick Dale', 'The Small Faces',
                                      'Norman Greenbaum', "Focus", "The Monkeys", "The Monkees",
                                      "Max Bygraves", "Bobby Pickett and The Crypt", "Spencer Davis Group",
                                      "The Beatles", "Van Morrison", "The Grass Roots", "Dire Straits",
                                      "Shocking Blue", "Syd Barrett", "Syd Barret", "The Band",
                                      "David Bowie & Bing Crosby", "Grateful Dead", "Dylan & The Dead",
                                      "Little Feet", "Loose Gravel", "Tom Petty & The Heartbreakers",
                                      "John Mellencamp", "The Rolling Stones", "Tom Petty", "The Velvet Underground",
                                      "Billy Idol", "Lou Reed", "The Police", "Cheap Trick", "The Vapors",
                                      "The Romantics", "The Solution", "The Beatles", "Mamas and the Papas",
                                      "Paul McCartney", "John Lennon", "Cat Stevens", "Paul Simon",
                                      "Neil Diamond", "Hall & Oates"
)] = 'Classic Rock'

## Save data to csv ####
#write_csv(count_df, '~/Desktop/cleaned_skatedata.csv3')
