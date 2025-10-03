import waitOn from "wait-on";
import neo4j from "neo4j-driver";
import dotenv from "dotenv";
dotenv.config();

// await waitOn({ resources: ["tcp:127.0.0.1:7687"], timeout: 30000 });

const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://127.0.0.1:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME || "neo4j",
    process.env.NEO4J_PASSWORD || "test1234"
  )
  // { encrypted: "ENCRYPTION_OFF" } // disable TLS if server.bolt.tls_level=DISABLED
);
const session = driver.session();

const users = [
  {
    id: "u1",
    name: "Aarav",
    email: "family1@mail.com",
    phone: "9001111111",
    address: "MG Road, Delhi",
  },
  {
    id: "u2",
    name: "Priya",
    email: "family1@mail.com",
    phone: "9002222222",
    address: "Andheri, Mumbai",
  },
  {
    id: "u3",
    name: "Rohan",
    email: "rohan@mail.com",
    phone: "9001111111",
    address: "Salt Lake, Kolkata",
  },
  {
    id: "u4",
    name: "Neha",
    email: "neha@mail.com",
    phone: "9004444444",
    address: "Koramangala, Bangalore",
  },
  {
    id: "u5",
    name: "Kiran",
    email: "kiran@mail.com",
    phone: "9005555555",
    address: "Banjara Hills, Hyderabad",
  },
  {
    id: "u6",
    name: "Siddharth",
    email: "family2@mail.com",
    phone: "9006666666",
    address: "Civil Lines, Jaipur",
  },
  {
    id: "u7",
    name: "Ananya",
    email: "family2@mail.com",
    phone: "9007777777",
    address: "Sector 18, Noida",
  },
  {
    id: "u8",
    name: "Manish",
    email: "manish@mail.com",
    phone: "9008888888",
    address: "Anna Nagar, Chennai",
  },
];

const transactions = [
  {
    id: "TXN1001",
    senderId: "u1",
    receiverId: "u2",
    amount: 500,
    ip: "192.168.1.1",
    deviceId: "DVC5001",
  },
  {
    id: "TXN1002",
    senderId: "u2",
    receiverId: "u3",
    amount: 1200,
    ip: "192.168.1.2",
    deviceId: "DVC5002",
  },
  {
    id: "TXN1003",
    senderId: "u3",
    receiverId: "u4",
    amount: 900,
    ip: "192.168.1.3",
    deviceId: "DVC5003",
  },
  {
    id: "TXN1004",
    senderId: "u1",
    receiverId: "u5",
    amount: 1500,
    ip: "192.168.1.1", // same IP as TXN1001
    deviceId: "DVC5004",
  },
  {
    id: "TXN1005",
    senderId: "u4",
    receiverId: "u6",
    amount: 2000,
    ip: "192.168.1.5",
    deviceId: "DVC5005",
  },
  {
    id: "TXN1006",
    senderId: "u6",
    receiverId: "u7",
    amount: 750,
    ip: "192.168.1.6",
    deviceId: "DVC5006",
  },
  {
    id: "TXN1007",
    senderId: "u7",
    receiverId: "u8",
    amount: 1300,
    ip: "192.168.1.7",
    deviceId: "DVC5007",
  },
  {
    id: "TXN1008",
    senderId: "u2",
    receiverId: "u6",
    amount: 850,
    ip: "192.168.1.2", // same IP as TXN1002
    deviceId: "DVC5008",
  },
  {
    id: "TXN1009",
    senderId: "u5",
    receiverId: "u1",
    amount: 600,
    ip: "192.168.1.9",
    deviceId: "DVC5009",
  },
  {
    id: "TXN1010",
    senderId: "u8",
    receiverId: "u3",
    amount: 1700,
    ip: "192.168.1.3", // same IP as TXN1003
    deviceId: "DVC5010",
  },
  {
    id: "TXN1011",
    senderId: "u6",
    receiverId: "u4",
    amount: 950,
    ip: "192.168.1.6", // same IP as TXN1006
    deviceId: "DVC5006", // same device as TXN1006
  },
  {
    id: "TXN1012",
    senderId: "u5",
    receiverId: "u7",
    amount: 400,
    ip: "192.168.1.1", // same as TXN1001
    deviceId: "DVC5001", // same as TXN1001
  },
];

async function createUsers() {
  for (const user of users) {
    await session.run(
      `MERGE (u:User {id: $id})
       SET u.name = $name, u.email = $email, u.phone = $phone, u.address = $address`,
      user
    );
  }
}

async function linkSharedAttributes() {
  await session.run(`
    MATCH (u1:User), (u2:User)
    WHERE u1.id <> u2.id
      AND (u1.email = u2.email OR u1.phone = u2.phone OR u1.address = u2.address)
    MERGE (u1)-[:SHARED_ATTRIBUTE]->(u2)
    MERGE (u2)-[:SHARED_ATTRIBUTE]->(u1)
  `);
}

async function createTransactions() {
  for (const tx of transactions) {
    await session.run(
      `MERGE (t:Transaction {id: $id})
       SET t.amount = $amount, t.ip = $ip, t.deviceId = $deviceId`,
      tx
    );

    await session.run(
      `MATCH (s:User {id: $senderId}), (t:Transaction {id: $id})
       MERGE (s)-[:DEBIT]->(t)`,
      tx
    );

    await session.run(
      `MATCH (r:User {id: $receiverId}), (t:Transaction {id: $id})
       MERGE (r)-[:CREDIT]->(t)`,
      tx
    );
  }
}

async function linkRelatedTransactions() {
  await session.run(`
    MATCH (t1:Transaction), (t2:Transaction)
    WHERE t1.id <> t2.id
      AND (t1.ip = t2.ip OR t1.deviceId = t2.deviceId)
    MERGE (t1)-[:RELATED_TO]->(t2)
    MERGE (t2)-[:RELATED_TO]->(t1)
  `);
}

try {
  console.log("🚀 Creating dummy database...");

  await createUsers();
  console.log("✅ Users created");

  await linkSharedAttributes();
  console.log("✅ Shared attributes linked");

  await createTransactions();
  console.log("✅ Transactions created");

  await linkRelatedTransactions();
  console.log("✅ Related transactions linked");

  console.log("🎉 Database created successfully");
} catch (err) {
  console.error("❌ Error during creation of dummy db:", err);
} finally {
  await session.close();
  await driver.close();
}
