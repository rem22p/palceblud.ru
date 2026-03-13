import { useState, useCallback } from "react";
import { RotateCcw, SkipForward, MoreHorizontal, ChevronDown } from "lucide-react";
import { useTyping, TypingDisplay } from "../components/TypingCore";

const WORD_POOL = [
  // Основные глаголы
  "be", "have", "do", "say", "get", "make", "go", "know", "take", "see",
  "come", "think", "look", "want", "give", "use", "find", "tell", "ask", "work",
  "seem", "feel", "try", "leave", "call", "good", "new", "first", "last", "long",
  "great", "little", "own", "other", "old", "right", "big", "high", "different", "small",
  "large", "next", "early", "young", "important", "few", "public", "bad", "same", "able",
  // Существительные
  "time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand",
  "part", "child", "eye", "woman", "place", "work", "week", "case", "point", "government",
  "company", "number", "group", "problem", "fact", "system", "program", "question", "business", "night",
  "word", "room", "mother", "area", "money", "story", "study", "side", "kind", "head",
  "house", "service", "friend", "father", "power", "hour", "game", "line", "end", "member",
  "law", "car", "city", "community", "name", "president", "team", "minute", "idea", "kid",
  "body", "information", "back", "parent", "face", "others", "level", "office", "door", "health",
  "person", "art", "war", "history", "party", "result", "change", "morning", "reason", "research",
  "girl", "guy", "moment", "air", "teacher", "force", "education", "foot", "boy", "age",
  // Прилагательные
  "about", "above", "after", "again", "against", "all", "almost", "alone", "along", "already",
  "also", "although", "always", "among", "another", "any", "anybody", "anyone", "anything", "anywhere",
  "around", "become", "before", "begin", "behind", "below", "between", "both", "brief", "but",
  "by", "can", "cannot", "could", "during", "each", "either", "else", "especially", "even",
  "ever", "every", "everybody", "everyone", "everything", "everywhere", "few", "for", "from", "further",
  "had", "has", "have", "having", "here", "herself", "him", "himself", "his", "how",
  "however", "if", "in", "indeed", "into", "it", "its", "itself", "just", "last",
  "later", "let", "like", "likely", "little", "made", "main", "make", "many", "may",
  "mean", "meanwhile", "might", "more", "moreover", "most", "mostly", "much", "must", "my",
  "myself", "namely", "need", "neither", "never", "nevertheless", "next", "nor", "not", "nothing",
  "now", "nowhere", "of", "off", "often", "on", "once", "only", "onto", "or",
  "other", "otherwise", "ought", "our", "ours", "ourselves", "out", "outside", "over", "own",
  "per", "perhaps", "quite", "rather", "really", "regarding", "same", "said", "say", "says",
  "second", "secondly", "see", "seem", "seemed", "seeming", "seems", "seen", "self", "selves",
  "sent", "several", "shall", "she", "should", "show", "showed", "shown", "showns", "shows",
  "side", "since", "sincere", "so", "some", "somebody", "someone", "something", "sometime", "sometimes",
  "somewhere", "such", "take", "taken", "than", "that", "the", "their", "theirs", "them",
  "themselves", "then", "there", "therefore", "these", "they", "this", "those", "though", "thought",
  "thoughts", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "toward",
  "towards", "under", "understand", "understood", "until", "up", "upon", "us", "use", "used",
  "using", "usually", "very", "want", "wanted", "wanting", "wants", "was", "way", "ways",
  "we", "well", "wells", "went", "were", "what", "whatever", "when", "whence", "whenever",
  "where", "whereafter", "whereas", "whereby", "wherein", "wheresoever", "whereupon", "wherever", "whether", "which",
  "while", "whither", "who", "whoever", "whole", "whom", "whomever", "whomsoever", "whose", "whosoever",
  "why", "will", "willing", "wish", "with", "within", "without", "won", "wonder", "would",
  // Дополнительные слова для разнообразия
  "practice", "typing", "speed", "accuracy", "keyboard", "fingers", "learn", "skill", "fast", "quick",
  "brown", "fox", "jumps", "over", "lazy", "dog", "hello", "world", "computer", "software",
  "hardware", "screen", "monitor", "mouse", "click", "type", "write", "read", "book", "page",
  "text", "code", "program", "function", "variable", "constant", "array", "object", "class", "method",
  "data", "database", "server", "client", "network", "internet", "website", "browser", "email", "message",
  "file", "folder", "document", "image", "video", "audio", "sound", "music", "song", "play",
  "stop", "pause", "start", "begin", "finish", "complete", "done", "ready", "set", "go",
  "run", "walk", "jump", "swim", "fly", "drive", "ride", "bike", "car", "train",
  "plane", "ship", "boat", "water", "fire", "earth", "air", "wind", "rain", "snow",
  "sun", "moon", "star", "sky", "cloud", "mountain", "river", "lake", "ocean", "sea",
  "tree", "flower", "grass", "plant", "animal", "bird", "fish", "cat", "dog", "horse",
  "food", "eat", "drink", "bread", "water", "milk", "coffee", "tea", "sugar", "salt",
  "house", "home", "room", "kitchen", "bedroom", "bathroom", "door", "window", "wall", "floor",
  "table", "chair", "bed", "lamp", "phone", "television", "radio", "clock", "watch", "key",
  "money", "dollar", "cent", "price", "cost", "buy", "sell", "shop", "store", "market",
  "work", "job", "office", "boss", "worker", "employee", "manager", "meeting", "project", "task",
  "school", "student", "teacher", "lesson", "class", "exam", "test", "question", "answer", "learn",
  "study", "read", "write", "draw", "paint", "sing", "dance", "play", "game", "sport",
  "football", "basketball", "tennis", "swimming", "running", "walking", "cycling", "hiking", "climbing", "skiing",
  "happy", "sad", "angry", "excited", "tired", "sleepy", "hungry", "thirsty", "hot", "cold",
  "warm", "cool", "wet", "dry", "clean", "dirty", "new", "old", "young", "ancient",
  "modern", "traditional", "classic", "simple", "complex", "easy", "hard", "difficult", "soft", "hard",
  "smooth", "rough", "sharp", "dull", "bright", "dark", "light", "heavy", "thin", "thick",
  "long", "short", "tall", "wide", "narrow", "deep", "shallow", "high", "low", "fast",
  "slow", "quick", "rapid", "speed", "time", "hour", "minute", "second", "day", "week",
  "month", "year", "century", "moment", "instant", "period", "season", "spring", "summer", "autumn",
  "winter", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "today", "tomorrow",
  "yesterday", "now", "then", "soon", "later", "early", "late", "before", "after", "during",
  "while", "until", "since", "from", "to", "at", "in", "on", "by", "with",
  "about", "against", "between", "into", "through", "during", "before", "after", "above", "below",
  "up", "down", "out", "off", "over", "under", "again", "further", "then", "once",
  "here", "there", "when", "where", "why", "how", "all", "each", "every", "both",
  "few", "more", "most", "other", "some", "such", "no", "not", "only", "own",
  "same", "so", "than", "too", "very", "can", "will", "just", "should", "now",
  "how", "what", "which", "who", "whom", "whose", "where", "when", "why", "that",
  "this", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
  "may", "might", "must", "shall", "can", "need", "dare", "ought", "used", "better",
  "best", "good", "well", "bad", "worse", "worst", "little", "less", "least", "much",
  "many", "more", "most", "some", "any", "all", "each", "every", "either", "neither",
  "both", "few", "several", "enough", "half", "whole", "part", "full", "empty", "long",
  "short", "small", "large", "big", "great", "little", "young", "old", "new", "early",
  "late", "high", "low", "right", "left", "correct", "wrong", "true", "false", "real",
  "fake", "actual", "virtual", "physical", "mental", "emotional", "spiritual", "material", "abstract", "concrete",
  "general", "specific", "particular", "special", "common", "usual", "normal", "regular", "standard", "typical",
  "average", "ordinary", "simple", "plain", "basic", "elementary", "fundamental", "essential", "necessary", "required",
  "optional", "possible", "impossible", "probable", "unlikely", "certain", "sure", "definite", "clear", "obvious",
  "evident", "apparent", "visible", "invisible", "hidden", "secret", "open", "closed", "public", "private",
  "personal", "individual", "collective", "social", "cultural", "political", "economic", "financial", "commercial", "industrial",
  "technological", "scientific", "academic", "educational", "professional", "vocational", "technical", "practical", "theoretical", "abstract",
  "creative", "artistic", "musical", "literary", "dramatic", "comic", "tragic", "romantic", "realistic", "fantastic",
  "magical", "mysterious", "strange", "weird", "odd", "unusual", "unique", "rare", "common", "frequent",
  "regular", "constant", "steady", "stable", "fixed", "permanent", "temporary", "brief", "short", "long",
  "eternal", "everlasting", "endless", "infinite", "limited", "restricted", "confined", "free", "independent", "dependent",
  "relative", "absolute", "complete", "total", "entire", "whole", "partial", "incomplete", "broken", "damaged",
  "perfect", "imperfect", "flawless", "faulty", "correct", "incorrect", "accurate", "inaccurate", "precise", "exact",
  "approximate", "rough", "smooth", "even", "uneven", "flat", "curved", "straight", "crooked", "bent",
  "round", "square", "triangular", "circular", "oval", "rectangular", "linear", "angular", "sharp", "blunt",
  "pointed", "dull", "bright", "brilliant", "dim", "dark", "light", "pale", "vivid", "colorful",
  "colorless", "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black",
  "white", "gray", "grey", "silver", "gold", "bronze", "copper", "iron", "steel", "aluminum",
  "wooden", "plastic", "glass", "metal", "paper", "cloth", "fabric", "leather", "rubber", "stone",
  "rock", "sand", "dirt", "soil", "mud", "dust", "ash", "smoke", "fire", "flame",
  "heat", "cold", "ice", "snow", "rain", "storm", "wind", "breeze", "hurricane", "tornado",
  "earthquake", "volcano", "flood", "drought", "weather", "climate", "temperature", "pressure", "humidity", "atmosphere",
  "sky", "cloud", "sun", "moon", "star", "planet", "earth", "mars", "jupiter", "saturn",
  "universe", "galaxy", "space", "cosmos", "astronomy", "astrology", "science", "physics", "chemistry", "biology",
  "mathematics", "geometry", "algebra", "calculus", "statistics", "probability", "logic", "philosophy", "psychology", "sociology",
  "anthropology", "history", "geography", "geology", "meteorology", "oceanography", "cartography", "demography", "economy", "ecology",
  "environment", "nature", "wildlife", "animal", "plant", "tree", "flower", "grass", "forest", "jungle",
  "desert", "mountain", "hill", "valley", "plain", "plateau", "island", "peninsula", "coast", "beach",
  "shore", "bank", "river", "stream", "creek", "lake", "pond", "pool", "ocean", "sea",
  "wave", "tide", "current", "waterfall", "spring", "well", "fountain", "dam", "bridge", "road",
  "street", "avenue", "boulevard", "highway", "freeway", "motorway", "path", "trail", "track", "lane",
  "alley", "court", "drive", "place", "square", "park", "garden", "yard", "lawn", "field",
  "meadow", "pasture", "farm", "ranch", "barn", "stable", "garage", "shed", "warehouse", "factory",
  "mill", "plant", "office", "building", "structure", "construction", "architecture", "design", "plan", "blueprint",
  "model", "pattern", "template", "sample", "example", "instance", "case", "situation", "condition", "state",
  "status", "position", "location", "place", "spot", "site", "area", "region", "zone", "district",
  "neighborhood", "community", "town", "city", "village", "metropolis", "capital", "country", "nation", "state",
  "province", "county", "parish", "municipality", "territory", "continent", "hemisphere", "globe", "world", "earth",
  "human", "person", "individual", "people", "population", "citizen", "resident", "inhabitant", "native", "foreigner",
  "stranger", "visitor", "tourist", "traveler", "passenger", "driver", "pilot", "captain", "sailor", "soldier",
  "officer", "general", "admiral", "president", "prime", "minister", "secretary", "treasurer", "manager", "director",
  "supervisor", "administrator", "executive", "official", "employee", "worker", "laborer", "clerk", "assistant", "helper",
  "servant", "slave", "master", "owner", "proprietor", "landlord", "tenant", "renter", "buyer", "seller",
  "customer", "client", "patient", "student", "pupil", "learner", "scholar", "researcher", "scientist", "professor",
  "teacher", "instructor", "trainer", "coach", "tutor", "mentor", "guide", "leader", "chief", "head",
  "boss", "supervisor", "manager", "director", "controller", "commander", "ruler", "governor", "mayor", "sheriff",
  "judge", "jury", "lawyer", "attorney", "counsel", "advocate", "prosecutor", "defendant", "plaintiff", "witness",
  "victim", "criminal", "thief", "robber", "burglar", "murderer", "killer", "assassin", "terrorist", "spy",
  "detective", "investigator", "inspector", "officer", "policeman", "guard", "security", "protection", "defense", "attack",
  "war", "battle", "fight", "combat", "conflict", "struggle", "contest", "competition", "race", "game",
  "sport", "match", "tournament", "championship", "league", "team", "player", "athlete", "champion", "winner",
  "loser", "victory", "defeat", "success", "failure", "achievement", "accomplishment", "goal", "objective", "target",
  "aim", "purpose", "intention", "plan", "scheme", "project", "program", "proposal", "suggestion", "recommendation",
  "advice", "counsel", "guidance", "direction", "instruction", "order", "command", "request", "demand", "requirement",
  "need", "want", "desire", "wish", "hope", "dream", "fantasy", "imagination", "vision", "idea",
  "thought", "concept", "notion", "theory", "hypothesis", "assumption", "belief", "opinion", "view", "perspective",
  "attitude", "approach", "method", "technique", "procedure", "process", "system", "mechanism", "device", "tool",
  "instrument", "equipment", "apparatus", "machine", "engine", "motor", "generator", "turbine", "reactor", "battery",
  "fuel", "gas", "oil", "petrol", "diesel", "electricity", "power", "energy", "force", "strength",
  "might", "vigor", "vitality", "health", "fitness", "wellness", "medicine", "drug", "pill", "tablet",
  "capsule", "injection", "vaccine", "treatment", "therapy", "cure", "remedy", "healing", "recovery", "rehabilitation",
  "exercise", "training", "practice", "rehearsal", "drill", "routine", "habit", "custom", "tradition", "culture",
  "civilization", "society", "community", "group", "organization", "association", "institution", "establishment", "foundation", "corporation",
  "company", "firm", "business", "enterprise", "venture", "industry", "trade", "commerce", "market", "economy",
  "finance", "banking", "investment", "stock", "share", "bond", "currency", "money", "cash", "credit",
  "debit", "loan", "mortgage", "interest", "profit", "loss", "income", "revenue", "expense", "cost",
  "price", "value", "worth", "quality", "quantity", "amount", "number", "figure", "digit", "numeral",
  "integer", "fraction", "decimal", "percentage", "ratio", "proportion", "scale", "size", "dimension", "measurement",
  "length", "width", "height", "depth", "distance", "space", "volume", "capacity", "weight", "mass",
  "density", "pressure", "temperature", "speed", "velocity", "acceleration", "momentum", "friction", "gravity", "magnetism",
  "electricity", "light", "sound", "heat", "cold", "energy", "matter", "substance", "material", "element",
  "compound", "mixture", "solution", "liquid", "solid", "gas", "plasma", "atom", "molecule", "particle",
  "electron", "proton", "neutron", "photon", "quark", "boson", "fermion", "hadron", "lepton", "meson",
  "nucleus", "orbit", "shell", "valence", "bond", "reaction", "catalyst", "enzyme", "protein", "amino",
  "acid", "base", "salt", "alkali", "oxide", "hydroxide", "sulfate", "nitrate", "carbonate", "phosphate",
  "chloride", "fluoride", "bromide", "iodide", "sulfide", "oxide", "peroxide", "superoxide", "ozonide", "hydride",
  "carbide", "nitride", "phosphide", "silicide", "boride", "arsenide", "selenide", "telluride", "polonide", "astatide",
  "francide", "radide", "actinide", "lanthanide", "transition", "metal", "nonmetal", "metalloid", "halogen", "noble",
  "gas", "alkali", "earth", "alkaline", "rare", "radioactive", "stable", "unstable", "isotope", "allotrope",
  "polymer", "monomer", "dimer", "trimer", "tetramer", "pentamer", "hexamer", "heptamer", "octamer", "nonamer",
  "decamer", "oligomer", "copolymer", "homopolymer", "biopolymer", "protein", "nucleic", "acid", "dna", "rna",
  "gene", "chromosome", "genome", "allele", "genotype", "phenotype", "mutation", "evolution", "species", "genus",
  "family", "order", "class", "phylum", "kingdom", "domain", "organism", "cell", "tissue", "organ",
  "system", "body", "organism", "individual", "population", "community", "ecosystem", "biosphere", "ecology", "environment",
  "habitat", "niche", "biome", "flora", "fauna", "vegetation", "wildlife", "biodiversity", "conservation", "preservation",
  "protection", "restoration", "rehabilitation", "reclamation", "recycling", "reuse", "reduce", "sustainable", "renewable", "green",
  "organic", "natural", "synthetic", "artificial", "man-made", "manufactured", "produced", "created", "invented", "discovered",
  "found", "explored", "researched", "studied", "investigated", "examined", "analyzed", "evaluated", "assessed", "tested",
  "experimented", "tried", "attempted", "endeavored", "strived", "struggled", "fought", "battled", "competed", "contested",
  "challenged", "confronted", "faced", "met", "encountered", "experienced", "underwent", "suffered", "endured", "tolerated",
  "bore", "carried", "supported", "sustained", "maintained", "kept", "held", "retained", "preserved", "conserved",
  "saved", "stored", "accumulated", "collected", "gathered", "assembled", "organized", "arranged", "ordered", "sorted",
  "classified", "categorized", "grouped", "divided", "separated", "isolated", "segregated", "discriminated", "distinguished", "differentiated",
  "compared", "contrasted", "matched", "paired", "coupled", "linked", "connected", "joined", "united", "combined",
  "merged", "integrated", "incorporated", "included", "contained", "comprised", "consisted", "constituted", "formed", "shaped",
  "molded", "cast", "forged", "hammered", "beaten", "struck", "hit", "punched", "kicked", "pushed",
  "pulled", "dragged", "lifted", "raised", "lowered", "dropped", "fell", "rose", "climbed", "descended",
  "ascended", "mounted", "dismounted", "entered", "exited", "arrived", "departed", "left", "stayed", "remained",
  "continued", "persisted", "lasted", "endured", "survived", "lived", "existed", "thrived", "flourished", "prospered",
  "succeeded", "failed", "fell", "collapsed", "crumbled", "deteriorated", "degenerated", "declined", "decreased", "diminished",
  "reduced", "lessened", "lowered", "dropped", "fell", "sank", "plunged", "dove", "jumped", "leaped",
  "bounded", "sprang", "hopped", "skipped", "danced", "pranced", "galloped", "trotted", "walked", "strolled",
  "wandered", "roamed", "traveled", "journeyed", "voyaged", "cruised", "sailed", "flew", "soared", "glided",
  "floated", "drifted", "swam", "dived", "plunged", "immersed", "submerged", "sank", "drowned", "perished",
  "died", "expired", "passed", "departed", "left", "went", "gone", "vanished", "disappeared", "faded",
  "faded", "dimmed", "darkened", "blackened", "whitened", "brightened", "lightened", "illuminated", "lit", "glowed",
  "shone", "sparkled", "twinkled", "glittered", "glistened", "shimmered", "flickered", "flashed", "blazed", "burned",
  "smoldered", "simmered", "boiled", "steamed", "evaporated", "condensed", "froze", "melted", "thawed", "dissolved",
  "mixed", "stirred", "shook", "vibrated", "oscillated", "swung", "swayed", "rocked", "rolled", "tumbled",
  "spun", "rotated", "revolved", "circled", "orbited", "looped", "coiled", "curled", "twisted", "bent",
  "folded", "creased", "wrinkled", "crumpled", "crushed", "smashed", "broke", "fractured", "cracked", "split",
  "tore", "ripped", "cut", "sliced", "chopped", "diced", "minced", "ground", "crushed", "powdered",
  "pulverized", "milled", "ground", "filed", "sanded", "polished", "buffed", "waxed", "oiled", "greased",
  "lubricated", "coated", "covered", "wrapped", "packed", "boxed", "bagged", "bottled", "canned", "jarred",
  "tinned", "sealed", "closed", "shut", "locked", "bolted", "latched", "fastened", "tied", "knotted",
  "bound", "secured", "anchored", "moored", "docked", "parked", "stationed", "positioned", "placed", "located",
  "situated", "based", "founded", "established", "instituted", "organized", "formed", "created", "made", "built",
  "constructed", "erected", "raised", "assembled", "manufactured", "produced", "generated", "developed", "designed", "planned",
  "schemed", "plotted", "mapped", "charted", "graphed", "diagrammed", "sketched", "drew", "painted", "colored",
  "shaded", "tinted", "dyed", "stained", "bleached", "whitened", "blackened", "darkened", "lightened", "brightened",
  "enhanced", "improved", "bettered", "upgraded", "advanced", "progressed", "developed", "evolved", "grew", "expanded",
  "increased", "multiplied", "doubled", "tripled", "quadrupled", "quintupled", "sextupled", "septupled", "octupled", "nonupled",
  "decupled", "centupled", "millupled", "maximized", "optimized", "perfected", "refined", "polished", "finished", "completed",
  "concluded", "ended", "terminated", "stopped", "ceased", "halted", "paused", "rested", "relaxed", "calmed",
  "soothed", "comforted", "consoled", "reassured", "encouraged", "supported", "helped", "assisted", "aided", "served",
  "attended", "waited", "cared", "nursed", "tended", "looked", "watched", "observed", "viewed", "saw",
  "looked", "gazed", "stared", "glanced", "peeked", "peered", "squinted", "blinked", "winked", "closed",
  "opened", "widened", "narrowed", "expanded", "contracted", "compressed", "expanded", "inflated", "deflated", "punctured",
  "pierced", "penetrated", "entered", "invaded", "infiltrated", "permeated", "saturated", "soaked", "drenched", "dampened",
  "moistened", "wetted", "dried", "dehydrated", "desiccated", "parched", "scorched", "burned", "charred", "singed",
  "toasted", "roasted", "baked", "broiled", "grilled", "fried", "sauteed", "steamed", "boiled", "poached",
  "simmered", "stewed", "braised", "casserole", "roasted", "baked", "grilled", "barbecued", "smoked", "cured",
  "pickled", "preserved", "canned", "bottled", "jarred", "packaged", "wrapped", "boxed", "bagged", "sacked",
  "crated", "barreled", "drummed", "tanked", "vatted", "tubbed", "bucketed", "pailed", "pitchered", "jug",
  "flasked", "vialled", "ampuled", "syringed", "injected", "infused", "instilled", "dripped", "dropped", "splashed",
  "spilled", "poured", "streamed", "flowed", "rushed", "gushed", "spurted", "squirted", "sprayed", "misted",
  "fogged", "clouded", "hazed", "smoked", "steamed", "vaporized", "evaporated", "sublimed", "condensed", "precipitated",
  "crystallized", "solidified", "hardened", "stiffened", "rigidified", "firmed", "tightened", "loosened", "relaxed", "slackened",
  "eased", "softened", "gentled", "mellowed", "ripened", "matured", "aged", "weathered", "eroded", "corroded",
  "rusted", "tarnished", "oxidized", "reduced", "neutralized", "balanced", "equilibrated", "stabilized", "steady", "calmed",
  "quieted", "silenced", "hushed", "muted", "dampened", "deadened", "stifled", "suppressed", "repressed", "subdued",
  "overcome", "conquered", "defeated", "beat", "won", "triumphed", "prevailed", "succeeded", "achieved", "accomplished",
  "attained", "reached", "arrived", "came", "went", "left", "departed", "exited", "entered", "joined",
  "met", "greeted", "welcomed", "received", "accepted", "took", "got", "obtained", "acquired", "gained",
  "earned", "won", "deserved", "merited", "qualified", "entitled", "authorized", "permitted", "allowed", "let",
  "enabled", "empowered", "facilitated", "helped", "assisted", "supported", "backed", "endorsed", "approved", "sanctioned",
  "authorized", "licensed", "certified", "accredited", "validated", "verified", "confirmed", "substantiated", "corroborated", "authenticated",
  "validated", "legitimized", "legalized", "authorized", "sanctioned", "approved", "endorsed", "supported", "backed", "sponsored",
  "financed", "funded", "invested", "donated", "contributed", "gave", "offered", "provided", "supplied", "furnished",
  "equipped", "outfitted", "armed", "weaponed", "tool", "instrumented", "geared", "rigged", "set", "prepared",
  "ready", "primed", "loaded", "charged", "fueled", "powered", "energized", "activated", "triggered", "initiated",
  "started", "began", "commenced", "launched", "introduced", "presented", "showed", "displayed", "exhibited", "demonstrated",
  "illustrated", "exemplified", "represented", "symbolized", "signified", "meant", "denoted", "indicated", "suggested", "implied",
  "insinuated", "hinted", "alluded", "referenced", "cited", "quoted", "mentioned", "noted", "remarked", "commented",
  "observed", "noticed", "perceived", "recognized", "identified", "distinguished", "discerned", "detected", "discovered", "found",
  "located", "spotted", "sighted", "espied", "glimpsed", "viewed", "saw", "watched", "observed", "monitored",
  "supervised", "oversaw", "managed", "controlled", "directed", "guided", "led", "commanded", "ordered", "instructed",
  "taught", "educated", "trained", "coached", "mentored", "tutored", "school", "schooled", "drilled", "practiced",
  "rehearsed", "exercised", "worked", "labored", "toiled", "slaved", "grinded", "slogged", "plugged", "pushed",
  "shoved", "pulled", "tugged", "yanked", "jerked", "snatched", "grabbed", "seized", "grasped", "gripped",
  "clutched", "held", "carried", "bore", "transported", "conveyed", "transmitted", "communicated", "conveyed", "expressed",
  "articulated", "enunciated", "pronounced", "uttered", "spoke", "talked", "conversed", "chatted", "gossiped", "gabbled",
  "jabbered", "prattled", "babbled", "blabbered", "chattered", "rattled", "clattered", "clanged", "clangor", "dinged",
  "donged", "ringed", "tolled", "pealed", "chimed", "tinkled", "jingled", "jangled", "jangled", "twanged",
  "pinged", "ponged", "boinged", "sprang", "leaped", "jumped", "hopped", "skipped", "bounded", "bounced",
  "rebounded", "ricocheted", "deflected", "reflected", "mirrored", "echoed", "reverberated", "resounded", "rang", "sounded",
  "noised", "roared", "bellowed", "yelled", "shouted", "screamed", "screeched", "shrieked", "yelped", "howled",
  "wailed", "moaned", "groaned", "sighed", "panted", "gasped", "huffed", "puffed", "blew", "exhaled",
  "inhaled", "breathed", "sniffed", "snuffed", "snorted", "sneezed", "coughed", "hack", "wheeze", "rasp",
  "gasp", "choke", "strangle", "suffocate", "smother", "asphyxiate", "drown", "sink", "plunge", "dive",
  "submerge", "immerse", "dip", "duck", "bob", "float", "drift", "sail", "cruise", "voyage",
  "journey", "travel", "tour", "trek", "hike", "march", "walk", "stride", "step", "pace",
  "tread", "tramp", "stomp", "stamp", "thump", "thud", "bang", "boom", "blast", "explode",
  "detonate", "ignite", "kindle", "light", "illuminate", "brighten", "glow", "shine", "gleam", "glisten",
  "glitter", "sparkle", "twinkle", "flicker", "flutter", "flap", "wave", "flail", "thrash", "lash",
  "whip", "crack", "snap", "pop", "burst", "break", "shatter", "smash", "crush", "squash",
  "squeeze", "press", "push", "shove", "nudge", "poke", "prod", "jab", "stab", "pierce",
  "penetrate", "enter", "invade", "infiltrate", "permeate", "saturate", "soak", "drench", "douse", "dunk",
  "dip", "immerse", "submerge", "plunge", "dive", "descend", "sink", "drop", "fall", "tumble",
  "topple", "overturn", "overturn", "capsize", "flip", "turn", "rotate", "spin", "whirl", "twirl",
  "swirl", "spiral", "coil", "curl", "twist", "writhe", "squirm", "wiggle", "waggle", "jiggle",
  "joggle", "wobble", "totter", "teeter", "stagger", "stumble", "trip", "slip", "slide", "skid",
  "glide", "coast", "drift", "float", "hover", "suspend", "hang", "dangle", "swing", "sway",
  "rock", "roll", "tumble", "somersault", "cartwheel", "handstand", "headstand", "balance", "poise", "steady",
  "stabilize", "secure", "fasten", "attach", "connect", "link", "join", "unite", "combine", "merge",
  "blend", "mix", "stir", "agitate", "shake", "vibrate", "oscillate", "pulsate", "throb", "beat",
  "pound", "hammer", "pound", "bash", "smash", "crash", "collide", "impact", "hit", "strike",
  "slap", "punch", "kick", "boot", "stamp", "stomp", "trample", "crush", "squash", "flatten",
  "level", "smooth", "even", "plane", "file", "sand", "polish", "buff", "shine", "gloss",
  "lacquer", "varnish", "paint", "coat", "cover", "wrap", "envelop", "encase", "enclose", "surround",
  "encircle", "ring", "gird", "belt", "band", "strap", "tie", "bind", "fasten", "secure",
  "anchor", "moor", "dock", "berth", "park", "station", "post", "place", "position", "locate",
  "situate", "set", "put", "lay", "rest", "repose", "lounge", "recline", "lean", "tilt",
  "slant", "slope", "incline", "decline", "descend", "ascend", "climb", "scale", "mount", "rise",
  "soar", "tower", "loom", "overshadow", "eclipse", "darken", "dim", "obscure", "hide", "conceal",
  "mask", "disguise", "camouflage", "cloak", "shroud", "veil", "cover", "blanket", "smother", "stifle",
  "choke", "strangle", "throttle", "garrote", "strangulate", "suffocate", "asphyxiate", "smother", "stifle", "suppress",
  "repress", "subdue", "overcome", "conquer", "defeat", "beat", "vanquish", "rout", "routing", "routed",
  "routs", "routing", "routed", "route", "router", "routes", "routing", "rout", "routs", "routed",
  "routing", "route", "router", "routes", "routing", "rout", "routs", "routed", "routing", "route",
];

const TIME_OPTIONS = [15, 30, 60, 120];
const WORD_OPTIONS: (number | "infinity")[] = [10, 25, 50, 100, "infinity"];

function generateText(wordCount: number) {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]);
  }
  return words.join(" ");
}

interface FloatingStatProps {
  value: string | number;
  label: string;
  color: string;
  labelColor?: string;
  size?: "xl" | "lg" | "md";
  align?: "left" | "right";
  muted?: boolean;
}

function FloatingStat({ value, label, color, labelColor, size = "xl", align = "left", muted = false }: FloatingStatProps) {
  const fontSize = size === "xl" ? "5rem" : size === "lg" ? "3.2rem" : "2rem";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "right" ? "flex-end" : "flex-start", gap: "2px", opacity: muted ? 0.18 : 1, transition: "opacity 0.4s ease" }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize, fontWeight: 200, color, lineHeight: 1, letterSpacing: "-0.04em", transition: "color 0.3s" }}>{value}</span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: labelColor || "rgba(224,224,224,0.25)", letterSpacing: "0.2em", textTransform: "uppercase" }}>{label === "wpm" ? "слов/мин" : label === "acc" ? "точн" : label === "sec" ? "сек" : label === "words" ? "слов" : label}</span>
    </div>
  );
}

interface ResultOverlayProps { 
  wpm: number; 
  accuracy: number;
  rawWpm: number;
  consistency: number;
  errorCount: number;
  onRestart: () => void; 
}

function ResultOverlay({ wpm, accuracy, rawWpm, consistency, errorCount, onRestart }: ResultOverlayProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "40px", animation: "fadeUp 0.5s ease forwards" }}>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "60px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "7rem", fontWeight: 200, color: "#ff6b35", lineHeight: 1, letterSpacing: "-0.04em" }}>{wpm}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "rgba(255,107,53,0.4)", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: "6px" }}>wpm</div>
        </div>
        <div style={{ textAlign: "center", paddingBottom: "12px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "3.5rem", fontWeight: 200, color: "#e0e0e0", lineHeight: 1, letterSpacing: "-0.04em" }}>{accuracy}%</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.25)", letterSpacing: "0.25em", textTransform: "uppercase", marginTop: "6px" }}>acc</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 200, color: "rgba(224,224,224,0.6)", lineHeight: 1 }}>{rawWpm}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.2)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "6px" }}>raw</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 200, color: "rgba(224,224,224,0.6)", lineHeight: 1 }}>{consistency}%</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(224,224,224,0.2)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "6px" }}>consistency</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 200, color: "#ff6b35", lineHeight: 1 }}>{errorCount}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(255,107,53,0.3)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "6px" }}>errors</div>
        </div>
      </div>
      <button onClick={onRestart} style={{ background: "none", border: "1px solid rgba(255,107,53,0.25)", borderRadius: "10px", padding: "10px 28px", color: "rgba(255,107,53,0.7)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,107,53,0.6)"; (e.currentTarget as HTMLButtonElement).style.color = "#ff6b35"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,107,53,0.25)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,107,53,0.7)"; }}>
        <RotateCcw size={13} /> new test
      </button>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.12)", letterSpacing: "0.15em" }}>tab - restart</span>
    </div>
  );
}

function ModeToggle({ mode, onChange, disabled }: { mode: "time" | "words"; onChange: (m: "time" | "words") => void; disabled?: boolean }) {
  return (
    <div style={{ position: "relative", display: "flex", width: "160px", height: "38px", backgroundColor: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "99px", padding: "4px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, userSelect: "none", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: "4px", left: mode === "time" ? "4px" : "calc(50% + 0px)", width: "calc(50% - 4px)", height: "30px", backgroundColor: "rgb(255, 107, 53)", borderRadius: "99px", transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 0 }} />
      <div onClick={() => !disabled && onChange("time")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, cursor: "pointer", pointerEvents: disabled ? "none" : "auto" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 600, color: mode === "time" ? "#171717" : "rgba(255, 255, 255, 0.4)", transition: "color 0.3s ease" }}>время</span>
      </div>
      <div onClick={() => !disabled && onChange("words")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, cursor: "pointer", pointerEvents: disabled ? "none" : "auto" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 600, color: mode === "words" ? "#171717" : "rgba(255, 255, 255, 0.4)", transition: "color 0.3s ease" }}>слова</span>
      </div>
    </div>
  );
}

export function PracticeMode() {
  const [mode, setMode] = useState<"time" | "words">("time");
  const [timeLimit, setTimeLimit] = useState(60);
  const [wordLimit, setWordLimit] = useState<number | "infinity">("infinity");
  const [showMenu, setShowMenu] = useState(false);
  const [text, setText] = useState(() => generateText(1000));
  
  const { typed, wpm, accuracy, rawWpm, consistency, errorCount, timeLeft, wordsLeft, isActive, isFinished, handleType, reset } = useTyping(text, { mode, timeLimit, wordLimit: wordLimit === "infinity" ? 999999 : wordLimit });

  const handleTypeWithExpand = useCallback((val: string) => {
    handleType(val);
    if (val.length > text.length * 0.8 && wordLimit === "infinity") {
      const newWords = generateText(100);
      setText((prev) => prev + " " + newWords);
    }
  }, [handleType, text.length, wordLimit]);

  const handleRestart = () => { setText(generateText(wordLimit === "infinity" ? 1000 : wordLimit)); reset(); };
  const handleModeChange = (newMode: "time" | "words") => { setText(generateText(newMode === "words" && wordLimit !== "infinity" ? wordLimit : 1000)); setMode(newMode); reset(); };
  const handleTimeChange = (s: number) => { setText(generateText(200)); setTimeLimit(s); setShowMenu(false); reset(); };
  const handleWordChange = (w: number | "infinity") => { setText(generateText(w === "infinity" ? 1000 : w)); setWordLimit(w); setShowMenu(false); reset(); };

  const timerColor = mode === "time" && timeLeft <= 5 && isActive ? "#ff4444" : "rgba(224,224,224,0.85)";
  const currentOptions = mode === "time" ? TIME_OPTIONS : WORD_OPTIONS;
  const currentValue = mode === "time" ? timeLimit : wordLimit;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#2b2d31", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "40px" }}>
      {!isFinished ? (
        <>
          <div style={{ position: "fixed", top: "11px", right: "110px", display: "flex", alignItems: "center", gap: "8px", zIndex: 99999 }}>
            <ModeToggle mode={mode} onChange={handleModeChange} disabled={isActive} />
            <div style={{ display: "flex", alignItems: "center", backgroundColor: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "99px", padding: "4px 12px", cursor: isActive ? "not-allowed" : "pointer", opacity: isActive ? 0.5 : 1, gap: "8px", height: "38px", minWidth: "90px", justifyContent: "space-between", flexShrink: 0 }} onClick={() => !isActive && setShowMenu(!showMenu)}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 600, color: "rgba(224,224,224,0.6)", minWidth: "50px", textAlign: "right" }}>{mode === "time" ? `${timeLimit}s` : wordLimit === "infinity" ? "∞" : `${wordLimit}`}</span>
              <ChevronDown size={14} style={{ color: "rgba(224,224,224,0.3)", flexShrink: 0 }} />
            </div>
            {showMenu && !isActive && (
              <>
                <div onClick={() => setShowMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 99998 }} />
                <div style={{ position: "absolute", top: "100%", right: "0", backgroundColor: "#1e2028", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "6px", zIndex: 99999, minWidth: "120px" }}>
                  {currentOptions.map((opt) => (
                    <button key={String(opt)} onClick={() => mode === "time" ? handleTimeChange(opt as number) : handleWordChange(opt as number | "infinity")} style={{ display: "block", width: "100%", padding: "8px 16px", background: "none", border: "none", borderRadius: "6px", color: opt === currentValue ? "#ff6b35" : "rgba(224,224,224,0.4)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", cursor: "pointer", textAlign: "right", backgroundColor: opt === currentValue ? "rgba(255,107,53,0.07)" : "transparent" }}>
                      {mode === "time" ? `${opt}s` : opt === "infinity" ? "∞" : opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ position: "fixed", top: "100px", left: "80px", zIndex: 10 }}><FloatingStat value={wpm} label="wpm" color="#ff6b35" labelColor="rgba(255,107,53,0.35)" size="xl" muted={!isActive} /></div>
          <div style={{ position: "fixed", top: "215px", left: "80px", zIndex: 10 }}><FloatingStat value={`${accuracy}%`} label="acc" color="rgba(224,224,224,0.55)" size="lg" muted={!isActive} /></div>
          <div style={{ position: "fixed", top: "100px", right: "80px", zIndex: 10 }}><FloatingStat value={mode === "time" ? (isActive ? timeLeft : timeLimit) : (wordLimit === "infinity" ? "∞" : wordsLeft)} label={mode === "time" ? "sec" : "words"} color={timerColor} size="xl" align="right" muted={!isActive} /></div>

          <div style={{ width: "100%", maxWidth: "2000px", padding: "0 40px", zIndex: 5, marginTop: "20px", margin: "0 auto" }}>
            <TypingDisplay
              text={text}
              typed={typed}
              onType={handleTypeWithExpand}
              onReset={handleRestart}
              colors={{
                correct: "rgba(224,224,224,0.9)",
                error: "#ff6b35",
                untyped: "rgba(224,224,224,0.18)",
                cursor: "#ff6b35",
                errorBg: "rgba(255,107,53,0.12)"
              }}
              isFinished={isFinished}
              fontSize="36px"
              lineHeight="40px"
              maxWidth="1200px"
            />
          </div>

          <div style={{ position: "fixed", bottom: "40px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "20px", opacity: isActive ? 0 : 1, transition: "opacity 0.3s ease", pointerEvents: isActive ? "none" : "auto", zIndex: 10 }}>
            <button onClick={handleRestart} title="Перезапустить (Tab)" style={{ background: "none", border: "none", color: "rgba(224,224,224,0.2)", cursor: "pointer", padding: "10px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}><RotateCcw size={17} /></button>
            <button onClick={() => { setText(generateText(wordLimit === "infinity" ? 1000 : wordLimit)); reset(); }} title="Следующий текст" style={{ background: "none", border: "none", color: "rgba(224,224,224,0.2)", cursor: "pointer", padding: "10px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}><SkipForward size={17} /></button>
            <button title="Ещё опции" style={{ background: "none", border: "none", color: "rgba(224,224,224,0.2)", cursor: "pointer", padding: "10px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}><MoreHorizontal size={17} /></button>
          </div>
          {!isActive && (<div style={{ position: "fixed", bottom: "16px", left: "50%", transform: "translateX(-50%)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.1)", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>tab — заново &nbsp;·&nbsp; esc — пауза</div>)}
        </>
      ) : (
        <ResultOverlay 
          wpm={wpm} 
          accuracy={accuracy} 
          rawWpm={rawWpm}
          consistency={consistency}
          errorCount={errorCount}
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
}