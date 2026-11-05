import User from "../models/User.js";

function generateRandomUsername() {
  const adjectives = ["cool", "fast", "smart", "bright", "mighty"];
  const nouns = ["lion", "tiger", "eagle", "shark", "wolf"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${adj}_${noun}_${num}`;
}

export async function generateUniqueUsername() {
  let username = generateRandomUsername();
  let exists = await User.findOne({ username });

  while (exists) {
    username = generateRandomUsername();
    exists = await User.findOne({ username });
  }

  return username;
}

export const getFileUrl = (file) => {
  if (!file) return null;
  if (file.path) return file.path;
  if (file.secure_url) return file.secure_url;
  if (file.url) return file.url;
  if (file.location) return file.location;
  return null;
};

export const shouldMarkVerified = (verification) => {
  if (!verification) return false;
  const status = (verification.status || "").toString().toLowerCase();
  // treat 'verified' or 'success' as affirmative (adjust if FastAPI uses another value)
  return status === "verified" || status === "success";
};


// Sample chats (you'll need to create these first or use existing ones)
export const sampleChats = [
  {
    _id: "68c90001d85ead214c5cf701",
    chatName: "Sandesh & Ameya",
    isGroupChat: false,
    users: ["68c46fcad85ead214c5cf6c1", "68c7f2d4ea0769a5607c4461"],
    createdAt: new Date("2025-09-14T10:00:00Z")
  },
  {
    _id: "68c90002d85ead214c5cf702", 
    chatName: "Study Group",
    isGroupChat: true,
    users: [
      "68c46fcad85ead214c5cf6c1",
      "68c7f2d4ea0769a5607c4461", 
      "68c7fe88d007b5f2b42015ee",
      "68c8007d7bf660186b31370d"
    ],
    groupAdmin: "68c46fcad85ead214c5cf6c1",
    createdAt: new Date("2025-09-13T15:30:00Z")
  },
  {
    _id: "68c90003d85ead214c5cf703",
    chatName: "Counselling Session",
    isGroupChat: false,
    users: ["68c826439e5df5d078ca6b87", "68c813205deb1bedc5d75f65"],
    createdAt: new Date("2025-09-15T16:00:00Z")
  }
];

// Dummy messages data
export const dummyMessages = [
  // One-on-one chat between Sandesh and Ameya
  {
    _id: "68d10001d85ead214c5cf801",
    sender: "68c46fcad85ead214c5cf6c1", // Sandesh
    content: "Hey Ameya, how's the assignment going?",
    chat: "68c90001d85ead214c5cf701",
    readBy: ["68c7f2d4ea0769a5607c4461"], // Ameya
    createdAt: new Date("2025-09-14T10:05:00Z"),
    updatedAt: new Date("2025-09-14T10:05:00Z")
  },
  {
    _id: "68d10002d85ead214c5cf802",
    sender: "68c7f2d4ea0769a5607c4461", // Ameya
    content: "Almost done! Just finishing up the conclusion. How about you?",
    chat: "68c90001d85ead214c5cf701",
    readBy: ["68c46fcad85ead214c5cf6c1"], // Sandesh
    createdAt: new Date("2025-09-14T10:07:00Z"),
    updatedAt: new Date("2025-09-14T10:07:00Z")
  },
  {
    _id: "68d10003d85ead214c5cf803",
    sender: "68c46fcad85ead214c5cf6c1", // Sandesh
    content: "I'm stuck on question 3. Can you help me later?",
    chat: "68c90001d85ead214c5cf701",
    readBy: ["68c7f2d4ea0769a5607c4461"], // Ameya
    createdAt: new Date("2025-09-14T10:10:00Z"),
    updatedAt: new Date("2025-09-14T10:10:00Z")
  },

  // Study Group chat messages
  {
    _id: "68d10004d85ead214c5cf804",
    sender: "68c46fcad85ead214c5cf6c1", // Sandesh
    content: "Welcome to the study group everyone!",
    chat: "68c90002d85ead214c5cf702",
    readBy: [
      "68c7f2d4ea0769a5607c4461",
      "68c7fe88d007b5f2b42015ee",
      "68c8007d7bf660186b31370d"
    ],
    createdAt: new Date("2025-09-13T15:35:00Z"),
    updatedAt: new Date("2025-09-13T15:35:00Z")
  },
  {
    _id: "68d10005d85ead214c5cf805",
    sender: "68c7fe88d007b5f2b42015ee", // Ashmit
    content: "Thanks for creating the group! When are we meeting?",
    chat: "68c90002d85ead214c5cf702",
    readBy: [
      "68c46fcad85ead214c5cf6c1",
      "68c7f2d4ea0769a5607c4461",
      "68c8007d7bf660186b31370d"
    ],
    createdAt: new Date("2025-09-13T15:40:00Z"),
    updatedAt: new Date("2025-09-13T15:40:00Z")
  },
  {
    _id: "68d10006d85ead214c5cf806",
    sender: "68c8007d7bf660186b31370d", // Sandesh (other account)
    content: "How about tomorrow at 3 PM in the library?",
    chat: "68c90002d85ead214c5cf702",
    readBy: [
      "68c46fcad85ead214c5cf6c1",
      "68c7f2d4ea0769a5607c4461"
    ],
    createdAt: new Date("2025-09-13T15:45:00Z"),
    updatedAt: new Date("2025-09-13T15:45:00Z")
  },
  {
    _id: "68d10007d85ead214c5cf807",
    sender: "68c7f2d4ea0769a5607c4461", // Ameya
    content: "Works for me! See you all then.",
    chat: "68c90002d85ead214c5cf702",
    readBy: [
      "68c46fcad85ead214c5cf6c1",
      "68c7fe88d007b5f2b42015ee"
    ],
    createdAt: new Date("2025-09-13T15:50:00Z"),
    updatedAt: new Date("2025-09-13T15:50:00Z")
  },

  // Counselling session messages
  {
    _id: "68d10008d85ead214c5cf808",
    sender: "68c813205deb1bedc5d75f65", // Samyak (student)
    content: "Hello, I'd like to discuss my course selection for next semester.",
    chat: "68c90003d85ead214c5cf703",
    readBy: ["68c826439e5df5d078ca6b87"], // Counsellor
    createdAt: new Date("2025-09-15T16:05:00Z"),
    updatedAt: new Date("2025-09-15T16:05:00Z")
  },
  {
    _id: "68d10009d85ead214c5cf809",
    sender: "68c826439e5df5d078ca6b87", // Counsellor
    content: "Of course, Samyak. What specific courses are you considering?",
    chat: "68c90003d85ead214c5cf703",
    readBy: ["68c813205deb1bedc5d75f65"], // Samyak
    createdAt: new Date("2025-09-15T16:10:00Z"),
    updatedAt: new Date("2025-09-15T16:10:00Z")
  },
  {
    _id: "68d10010d85ead214c5cf810",
    sender: "68c813205deb1bedc5d75f65", // Samyak
    content: "I'm thinking about Advanced Algorithms and Machine Learning.",
    chat: "68c90003d85ead214c5cf703",
    readBy: [], // Not read yet
    createdAt: new Date("2025-09-15T16:15:00Z"),
    updatedAt: new Date("2025-09-15T16:15:00Z")
  }
];